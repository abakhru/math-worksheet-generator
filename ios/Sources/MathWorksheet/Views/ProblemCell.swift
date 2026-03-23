import SwiftUI

struct ProblemCell: View {
    let problem: MathProblem
    let showAnswer: Bool
    let accentColor: Color

    var body: some View {
        VStack(alignment: .trailing, spacing: 2) {
            Text("\(problem.operand1)")
                .font(.system(.title2, design: .monospaced).weight(.semibold))

            HStack(spacing: 4) {
                Text(problem.symbol)
                    .font(.system(.title2, design: .monospaced).weight(.semibold))
                    .foregroundStyle(accentColor)
                Text("\(problem.operand2)")
                    .font(.system(.title2, design: .monospaced).weight(.semibold))
            }

            Rectangle()
                .frame(height: 1.5)
                .foregroundStyle(Color.primary.opacity(0.4))

            if showAnswer {
                Text("\(problem.answer)")
                    .font(.system(.title2, design: .monospaced).weight(.semibold))
                    .foregroundStyle(.green)
            } else {
                Color.clear.frame(height: 28)
            }
        }
        .padding(8)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}
