import Foundation

struct MathProblem: Identifiable {
    let id = UUID()
    let operand1: Int
    let operand2: Int
    let operation: WorksheetConfig.Operation

    var answer: Int {
        switch operation {
        case .addition: return operand1 + operand2
        case .subtraction: return operand1 - operand2
        case .multiplication: return operand1 * operand2
        case .mix: preconditionFailure("Mix should be resolved before creating a problem")
        }
    }

    var symbol: String { operation.symbol }
}
