import UIKit
import PDFKit

struct PDFGenerator {
    static let columns = 4
    static let pageSize = CGSize(width: 612, height: 792) // US Letter portrait
    static let margin: CGFloat = 36
    static let cellWidth: CGFloat = (612 - 72) / CGFloat(columns)
    static let cellHeight: CGFloat = 90

    func generatePDF(problems: [MathProblem], config: WorksheetConfig, showAnswers: Bool) -> Data {
        let renderer = UIGraphicsPDFRenderer(bounds: CGRect(origin: .zero, size: Self.pageSize))

        return renderer.pdfData { ctx in
            let usableWidth = Self.pageSize.width - 2 * Self.margin
            let cellW = usableWidth / CGFloat(Self.columns)
            let cellH = Self.cellHeight

            let rows = Int(ceil(Double(problems.count) / Double(Self.columns)))
            let contentHeight = CGFloat(rows) * cellH + 80 // +80 for header
            let pages = Int(ceil(contentHeight / (Self.pageSize.height - 2 * Self.margin)))

            var problemIndex = 0
            let problemsPerPage = Int(floor((Self.pageSize.height - 2 * Self.margin - 60) / cellH)) * Self.columns

            for page in 0..<max(1, pages) {
                ctx.beginPage()
                drawHeader(operation: config.operation.rawValue, page: page + 1)

                let startIdx = page * problemsPerPage
                let endIdx = min(startIdx + problemsPerPage, problems.count)
                problemIndex = startIdx

                var col = 0
                var row = 0

                for i in startIdx..<endIdx {
                    let x = Self.margin + CGFloat(col) * cellW
                    let y = Self.margin + 60 + CGFloat(row) * cellH
                    drawProblem(problems[i], at: CGPoint(x: x, y: y), width: cellW, showAnswer: showAnswers)
                    col += 1
                    if col >= Self.columns {
                        col = 0
                        row += 1
                    }
                }
            }
        }
    }

    private func drawHeader(operation: String, page: Int) {
        let title = "Math Worksheet — \(operation)"
        let attrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 18),
            .foregroundColor: UIColor.darkText
        ]
        title.draw(at: CGPoint(x: Self.margin, y: Self.margin), withAttributes: attrs)

        let dateStr = DateFormatter.localizedString(from: Date(), dateStyle: .medium, timeStyle: .none)
        let subAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 11),
            .foregroundColor: UIColor.gray
        ]
        dateStr.draw(at: CGPoint(x: Self.margin, y: Self.margin + 24), withAttributes: subAttrs)

        // Divider line
        let path = UIBezierPath()
        path.move(to: CGPoint(x: Self.margin, y: Self.margin + 44))
        path.addLine(to: CGPoint(x: Self.pageSize.width - Self.margin, y: Self.margin + 44))
        UIColor.lightGray.setStroke()
        path.lineWidth = 0.5
        path.stroke()
    }

    private func drawProblem(_ problem: MathProblem, at origin: CGPoint, width: CGFloat, showAnswer: Bool) {
        let numberFont = UIFont(name: "Courier-Bold", size: 22) ?? UIFont.monospacedDigitSystemFont(ofSize: 22, weight: .bold)
        let smallFont = UIFont(name: "Courier", size: 14) ?? UIFont.monospacedDigitSystemFont(ofSize: 14, weight: .regular)

        let op1Str = "\(problem.operand1)"
        let op2Str = "\(problem.operand2)"
        let symStr = problem.symbol
        let ansStr = showAnswer ? "\(problem.answer)" : ""

        let maxLen = max(op1Str.count, op2Str.count + 1) // +1 for symbol
        let charWidth: CGFloat = 14
        let rightEdge = origin.x + width - 20

        let attrs: [NSAttributedString.Key: Any] = [.font: numberFont, .foregroundColor: UIColor.darkText]
        let smallAttrs: [NSAttributedString.Key: Any] = [.font: smallFont, .foregroundColor: UIColor.gray]

        // top operand (right-aligned)
        let op1Size = op1Str.size(withAttributes: attrs)
        op1Str.draw(at: CGPoint(x: rightEdge - op1Size.width, y: origin.y + 4), withAttributes: attrs)

        // symbol + bottom operand (right-aligned)
        let op2Full = "\(symStr) \(op2Str)"
        let op2Size = op2Full.size(withAttributes: attrs)
        op2Str.draw(at: CGPoint(x: rightEdge - op2Size.width + smallFont.capHeight, y: origin.y + 30), withAttributes: attrs)
        symStr.draw(at: CGPoint(x: rightEdge - op2Size.width, y: origin.y + 30), withAttributes: attrs)

        // underline
        let lineY = origin.y + 56
        let lineStart = rightEdge - CGFloat(maxLen + 1) * charWidth
        let path = UIBezierPath()
        path.move(to: CGPoint(x: lineStart, y: lineY))
        path.addLine(to: CGPoint(x: rightEdge, y: lineY))
        UIColor.darkGray.setStroke()
        path.lineWidth = 1.0
        path.stroke()

        // answer
        if showAnswer {
            let ansSize = ansStr.size(withAttributes: attrs)
            ansStr.draw(at: CGPoint(x: rightEdge - ansSize.width, y: origin.y + 60), withAttributes: attrs)
        }
    }
}
