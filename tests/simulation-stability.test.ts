import { describe, it, beforeEach, expect } from "vitest"

describe("Simulation Stability Monitoring Contract", () => {
  let mockStorage: Map<string, any>
  let currentBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    currentBlockHeight = 100
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "report-stability":
        const [simulationId, stabilityScore, issues] = args
        mockStorage.set(simulationId, {
          last_check: currentBlockHeight,
          stability_score: stabilityScore,
          issues,
        })
        return { success: true }
      case "get-stability-report":
        return { success: true, value: mockStorage.get(args[0]) }
      case "is-simulation-stable":
        const report = mockStorage.get(args[0])
        return { success: true, value: report ? report.stability_score >= 80 : false }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should report stability", () => {
    const result = mockContractCall("report-stability", [0, 90, ["Minor glitch"]])
    expect(result.success).toBe(true)
  })
  
  it("should get a stability report", () => {
    mockContractCall("report-stability", [0, 90, ["Minor glitch"]])
    const result = mockContractCall("get-stability-report", [0])
    expect(result.success).toBe(true)
    expect(result.value.stability_score).toBe(90)
    expect(result.value.issues).toEqual(["Minor glitch"])
  })
  
  it("should check if a simulation is stable", () => {
    mockContractCall("report-stability", [0, 90, ["Minor glitch"]])
    const result = mockContractCall("is-simulation-stable", [0])
    expect(result.success).toBe(true)
    expect(result.value).toBe(true)
  })
  
  it("should report an unstable simulation", () => {
    mockContractCall("report-stability", [1, 70, ["Major physics inconsistency"]])
    const result = mockContractCall("is-simulation-stable", [1])
    expect(result.success).toBe(true)
    expect(result.value).toBe(false)
  })
})

