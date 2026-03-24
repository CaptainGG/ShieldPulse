from __future__ import annotations

from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

import feedparser
import httpx
from dateutil import parser as date_parser

from app.core.config import Settings
from app.schemas import SignalItem

SOURCE_WEIGHTS: dict[str, float] = {
    "Reuters": 1.0,
    "AP": 1.0,
    "FRED": 0.95,
    "SEC EDGAR": 0.95,
    "WHO": 0.95,
    "NASA EONET": 0.95,
    "Alpha Vantage": 0.8,
    "Polygon": 0.8,
    "OpenWeatherMap": 0.8,
    "GDELT": 0.8,
    "NewsAPI": 0.7,
    "Reddit": 0.35,
    "X": 0.35,
}


def _published_at(raw_value: str | None) -> datetime:
    if not raw_value:
        return datetime.now(UTC)
    try:
        parsed = date_parser.parse(raw_value)
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)
    except (ValueError, TypeError):
        return datetime.now(UTC)


def _signal(
    *,
    source: str,
    domain: str,
    title: str,
    summary: str,
    url: str,
    published_at: str | None,
    source_type: str,
    raw_metadata: dict[str, Any] | None = None,
) -> SignalItem:
    return SignalItem(
        id=f"signal-{uuid4().hex[:16]}",
        source=source,
        domain=domain,  # type: ignore[arg-type]
        title=title,
        summary=summary,
        url=url,
        publishedAt=_published_at(published_at),
        sourceType=source_type,
        credibilityScore=SOURCE_WEIGHTS[source],
        rawMetadata=raw_metadata or {},
    )


async def fetch_reddit_signals(client: httpx.AsyncClient) -> list[SignalItem]:
    signals: list[SignalItem] = []
    for subreddit, domain in (("worldnews", "geopolitics"), ("investing", "finance")):
        response = await client.get(
            f"https://www.reddit.com/r/{subreddit}/hot.json",
            params={"limit": 5},
            headers={"User-Agent": "oracle-app/0.1"},
        )
        response.raise_for_status()
        children = response.json().get("data", {}).get("children", [])
        for item in children:
            data = item.get("data", {})
            signals.append(
                _signal(
                    source="Reddit",
                    domain=domain,
                    title=data.get("title", "Untitled Reddit signal"),
                    summary=data.get("selftext", "")[:320] or "High-attention community conversation around this topic.",
                    url=f"https://www.reddit.com{data.get('permalink', '/')}",
                    published_at=datetime.fromtimestamp(data.get("created_utc", datetime.now(UTC).timestamp()), tz=UTC).isoformat(),
                    source_type="social",
                    raw_metadata={"subreddit": subreddit, "score": data.get("score", 0)},
                )
            )
    return signals


async def fetch_fred_signals(client: httpx.AsyncClient) -> list[SignalItem]:
    response = await client.get("https://fred.stlouisfed.org/graph/fredgraph.csv", params={"id": "DGS10"})
    response.raise_for_status()
    lines = [line for line in response.text.splitlines() if line.strip()]
    latest = lines[-1].split(",") if len(lines) > 1 else ["", "n/a"]
    return [
        _signal(
            source="FRED",
            domain="finance",
            title="Treasury benchmark levels continue to frame the macro backdrop.",
            summary=f"The latest available 10-year Treasury reading is {latest[-1]}.",
            url="https://fred.stlouisfed.org/series/DGS10",
            published_at=datetime.now(UTC).isoformat(),
            source_type="macro",
            raw_metadata={"series": "DGS10", "value": latest[-1]},
        )
    ]


async def fetch_gdelt_signals(client: httpx.AsyncClient) -> list[SignalItem]:
    response = await client.get(
        "https://api.gdeltproject.org/api/v2/doc/doc",
        params={
            "query": "(trade OR diplomacy OR tariff OR shipping) sourcecountry:US",
            "mode": "ArtList",
            "maxrecords": 5,
            "format": "json",
        },
    )
    response.raise_for_status()
    articles = response.json().get("articles", [])
    return [
        _signal(
            source="GDELT",
            domain="geopolitics",
            title=article.get("title", "GDELT signal"),
            summary=article.get("seendate", "") or "GDELT narrative cluster detected around geopolitics.",
            url=article.get("url", "https://www.gdeltproject.org/"),
            published_at=article.get("seendate"),
            source_type="aggregator",
            raw_metadata={"sourcecountry": article.get("sourcecountry")},
        )
        for article in articles
    ]


async def fetch_rss_signals(client: httpx.AsyncClient) -> list[SignalItem]:
    feeds = [
        ("https://apnews.com/hub/ap-top-news/rss.xml", "AP", "geopolitics"),
        ("https://feeds.reuters.com/reuters/businessNews", "Reuters", "finance"),
        ("https://www.who.int/feeds/entity/csr/don/en/rss.xml", "WHO", "health"),
        ("https://www.sec.gov/news/pressreleases.rss", "SEC EDGAR", "finance"),
    ]
    signals: list[SignalItem] = []
    for url, source, domain in feeds:
        payload = await client.get(url)
        payload.raise_for_status()
        parsed = feedparser.parse(payload.text)
        for entry in parsed.entries[:5]:
            signals.append(
                _signal(
                    source=source,
                    domain=domain,
                    title=getattr(entry, "title", f"{source} headline"),
                    summary=getattr(entry, "summary", "")[:320] or f"{source} RSS headline relevant to {domain}.",
                    url=getattr(entry, "link", url),
                    published_at=getattr(entry, "published", None),
                    source_type="news" if source in {"AP", "Reuters"} else "gov",
                    raw_metadata={},
                )
            )
    return signals


async def fetch_alpha_vantage_signals(client: httpx.AsyncClient, settings: Settings) -> list[SignalItem]:
    if not settings.alpha_vantage_api_key:
        return []
    response = await client.get(
        "https://www.alphavantage.co/query",
        params={"function": "TOP_GAINERS_LOSERS", "apikey": settings.alpha_vantage_api_key},
    )
    response.raise_for_status()
    data = response.json()
    top_gainers = data.get("top_gainers", [])[:3]
    signals: list[SignalItem] = []
    for item in top_gainers:
        signals.append(
            _signal(
                source="Alpha Vantage",
                domain="finance",
                title=f"{item.get('ticker', 'Ticker')} is moving sharply.",
                summary=f"Price change: {item.get('change_percentage', 'n/a')} with volume {item.get('volume', 'n/a')}.",
                url="https://www.alphavantage.co/",
                published_at=datetime.now(UTC).isoformat(),
                source_type="market",
                raw_metadata=item,
            )
        )
    return signals


async def fetch_openweather_signals(client: httpx.AsyncClient, settings: Settings) -> list[SignalItem]:
    if not settings.openweathermap_api_key:
        return []
    response = await client.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={"q": "Chicago,US", "appid": settings.openweathermap_api_key, "units": "metric"},
    )
    response.raise_for_status()
    payload = response.json()
    return [
        _signal(
            source="OpenWeatherMap",
            domain="health",
            title="Weather volatility raises downstream concern for agricultural and respiratory stress.",
            summary=f"Observed temperature {payload.get('main', {}).get('temp', 'n/a')}C with conditions {payload.get('weather', [{}])[0].get('description', 'unknown')}.",
            url="https://openweathermap.org/",
            published_at=datetime.now(UTC).isoformat(),
            source_type="alt",
            raw_metadata=payload,
        )
    ]


async def fetch_nasa_eonet_signals(client: httpx.AsyncClient) -> list[SignalItem]:
    response = await client.get("https://eonet.gsfc.nasa.gov/api/v3/events", params={"status": "open", "limit": 5})
    response.raise_for_status()
    payload = response.json()
    events = payload.get("events", [])
    signals: list[SignalItem] = []
    for event in events[:3]:
        title = event.get("title", "NASA EONET event")
        categories = ", ".join(category.get("title", "") for category in event.get("categories", []))
        geometry = event.get("geometry", [{}])[-1]
        signals.append(
            _signal(
                source="NASA EONET",
                domain="health",
                title=title,
                summary=f"Open Earth event tracked by NASA EONET. Categories: {categories or 'unclassified'}.",
                url=event.get("link", "https://eonet.gsfc.nasa.gov/"),
                published_at=geometry.get("date"),
                source_type="alt",
                raw_metadata={"categories": event.get("categories", [])},
            )
        )
    return signals


async def fetch_optional_newsapi_signals(client: httpx.AsyncClient, settings: Settings) -> list[SignalItem]:
    if not settings.news_api_key:
        return []
    response = await client.get(
        "https://newsapi.org/v2/top-headlines",
        params={"category": "business", "pageSize": 5, "apiKey": settings.news_api_key},
    )
    response.raise_for_status()
    articles = response.json().get("articles", [])
    return [
        _signal(
            source="NewsAPI",
            domain="tech",
            title=article.get("title", "NewsAPI headline"),
            summary=article.get("description", "") or "NewsAPI aggregated technology headline.",
            url=article.get("url", "https://newsapi.org/"),
            published_at=article.get("publishedAt"),
            source_type="news",
            raw_metadata={"source": article.get("source", {})},
        )
        for article in articles
    ]


async def fetch_optional_polygon_signals(client: httpx.AsyncClient, settings: Settings) -> list[SignalItem]:
    if not settings.polygon_api_key:
        return []
    response = await client.get(
        "https://api.polygon.io/v2/aggs/ticker/SPY/prev",
        params={"apiKey": settings.polygon_api_key},
    )
    response.raise_for_status()
    payload = response.json()
    result = payload.get("results", [{}])[0]
    return [
        _signal(
            source="Polygon",
            domain="finance",
            title="Optional Polygon market snapshot is available for richer equity context.",
            summary=f"Previous close {result.get('c', 'n/a')} with volume {result.get('v', 'n/a')}.",
            url="https://polygon.io/",
            published_at=datetime.now(UTC).isoformat(),
            source_type="market",
            raw_metadata=result,
        )
    ]


async def fetch_optional_x_signals(client: httpx.AsyncClient, settings: Settings) -> list[SignalItem]:
    if not settings.x_api_bearer_token:
        return []
    return []


async def fetch_all_signals(settings: Settings) -> list[SignalItem]:
    timeout = httpx.Timeout(settings.request_timeout_seconds)
    async with httpx.AsyncClient(timeout=timeout) as client:
        tasks = [
            fetch_reddit_signals(client),
            fetch_fred_signals(client),
            fetch_gdelt_signals(client),
            fetch_rss_signals(client),
            fetch_alpha_vantage_signals(client, settings),
            fetch_openweather_signals(client, settings),
            fetch_nasa_eonet_signals(client),
            fetch_optional_newsapi_signals(client, settings),
            fetch_optional_polygon_signals(client, settings),
            fetch_optional_x_signals(client, settings),
        ]

        all_signals: list[SignalItem] = []
        for task in tasks:
            try:
                all_signals.extend(await task)
            except Exception:
                continue
        return all_signals
