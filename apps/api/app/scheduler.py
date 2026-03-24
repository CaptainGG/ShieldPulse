from __future__ import annotations

import asyncio

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.database import Base, SessionLocal, engine
from app.services.pipeline import generate_digest


async def scheduled_digest_run() -> None:
    with SessionLocal() as session:
        await generate_digest(session)


def main() -> None:
    Base.metadata.create_all(bind=engine)
    scheduler = AsyncIOScheduler(timezone="UTC")
    scheduler.add_job(scheduled_digest_run, CronTrigger(hour=6, minute=0))
    scheduler.start()
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    main()
