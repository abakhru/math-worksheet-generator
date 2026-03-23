import Foundation

struct WorksheetConfig {
    enum Operation: String, CaseIterable, Identifiable {
        case addition = "Addition"
        case subtraction = "Subtraction"
        case multiplication = "Multiplication"
        case mix = "Mix"

        var id: String { rawValue }

        var symbol: String {
            switch self {
            case .addition: return "+"
            case .subtraction: return "−"
            case .multiplication: return "×"
            case .mix: return "?"
            }
        }
    }

    var operation: Operation = .addition
    var questionCount: Int = 20
    var startNum: Int = 1
    var endNum: Int = 99
    var showTables: Bool = false
    var showAnswers: Bool = false
}
