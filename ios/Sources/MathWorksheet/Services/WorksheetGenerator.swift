import Foundation

struct WorksheetGenerator {
    func generate(config: WorksheetConfig) -> [MathProblem] {
        (0..<config.questionCount).map { _ in
            let op = resolvedOperation(config.operation)
            let (a, b) = pair(for: op, config: config)
            return MathProblem(operand1: a, operand2: b, operation: op)
        }.shuffled()
    }

    private func resolvedOperation(_ op: WorksheetConfig.Operation) -> WorksheetConfig.Operation {
        guard op == .mix else { return op }
        return [.addition, .subtraction, .multiplication].randomElement()!
    }

    private func pair(for op: WorksheetConfig.Operation, config: WorksheetConfig) -> (Int, Int) {
        if config.showTables && op == .multiplication {
            return (Int.random(in: 2...12), Int.random(in: 2...12))
        }
        let lo = min(config.startNum, config.endNum)
        let hi = max(config.startNum, config.endNum)
        let range = lo...hi
        let a = Int.random(in: range)
        let b = Int.random(in: range)
        // subtraction: ensure non-negative result
        if op == .subtraction { return (max(a, b), min(a, b)) }
        return (a, b)
    }
}
