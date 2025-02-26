import { describe, it, beforeEach, expect } from "vitest"

describe("Experience Licensing Contract", () => {
  let mockStorage: Map<string, any>
  let nextLicenseId: number
  let currentBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextLicenseId = 0
    currentBlockHeight = 100
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "issue-license":
        const [simulationId, licensee, duration] = args
        const id = nextLicenseId++
        mockStorage.set(id, {
          simulation_id: simulationId,
          licensee,
          expiration: currentBlockHeight + duration,
        })
        return { success: true, value: id }
      case "check-license":
        const license = mockStorage.get(args[0])
        return { success: true, value: license ? currentBlockHeight < license.expiration : false }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should issue a license", () => {
    const result = mockContractCall("issue-license", [0, "user123", 1000])
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
  
  it("should check a valid license", () => {
    mockContractCall("issue-license", [0, "user123", 1000])
    const result = mockContractCall("check-license", [0])
    expect(result.success).toBe(true)
    expect(result.value).toBe(true)
  })
  
  it("should check an expired license", () => {
    mockContractCall("issue-license", [0, "user123", 1000])
    currentBlockHeight += 1001
    const result = mockContractCall("check-license", [0])
    expect(result.success).toBe(true)
    expect(result.value).toBe(false)
  })
})

