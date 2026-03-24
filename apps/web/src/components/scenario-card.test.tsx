import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ScenarioCard } from "@/components/scenario-card";
import { mockCurrentReport } from "@/lib/mock-data";

describe("ScenarioCard", () => {
  it("renders a workstream headline and evidence drawer", () => {
    render(<ScenarioCard insight={mockCurrentReport.workstreams[0]} />);

    expect(screen.getByText(/store conversion is rebounding/i)).toBeInTheDocument();
    expect(screen.getAllByText(/analyst confidence/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/evidence pack/i).length).toBeGreaterThan(0);
  });
});
