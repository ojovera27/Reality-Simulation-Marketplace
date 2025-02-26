import { describe, it, beforeEach, expect } from "vitest"

describe("Simulation Creation Contract", () => {
  let mockStorage: Map<string, any>
  let nextSimulationId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextSimulationId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "create-simulation":
        const [name, description, physicsHash] = args
        const id = nextSimulationId++
        mockStorage.set(id, {
          creator: "tx-sender",
          name,
          description,
          physics_hash: physicsHash,
        })
        return { success: true, value: id }
      case "get-simulation":
        return { success: true, value: mockStorage.get(args[0]) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a simulation", () => {
    const result = mockContractCall("create-simulation", ["Test Sim", "A test simulation", "0x1234567890abcdef"])
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
  
  it("should get a simulation", () => {
    mockContractCall("create-simulation", ["Test Sim", "A test simulation", "0x1234567890abcdef"])
    const result = mockContractCall("get-simulation", [0])
    expect(result.success).toBe(true)
    expect(result.value.name).toBe("Test Sim")
    expect(result.value.description).toBe("A test simulation")
    expect(result.value.physics_hash).toBe("0x1234567890abcdef")
  })
})

