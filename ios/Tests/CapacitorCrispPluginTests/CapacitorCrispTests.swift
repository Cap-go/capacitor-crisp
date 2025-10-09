import XCTest
@testable import CapacitorCrispPlugin

final class CapacitorCrispTests: XCTestCase {
    func testEcho() {
        // Ensure the helper echoes back the provided value.
        let implementation = CapacitorCrisp()
        let value = "Hello, World!"
        let result = implementation.echo(value)

        XCTAssertEqual(value, result)
    }
}
