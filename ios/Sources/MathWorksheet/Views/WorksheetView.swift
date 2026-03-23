import SwiftUI

struct WorksheetView: View {
    let problems: [MathProblem]
    let config: WorksheetConfig

    @State private var showAnswers = false
    @State private var shareItem: ShareItem?

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 4)
    private let accentColors: [Color] = [.blue, .purple, .orange, .pink, .teal, .indigo, .cyan]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(Array(problems.enumerated()), id: \.element.id) { index, problem in
                    ProblemCell(
                        problem: problem,
                        showAnswer: showAnswers,
                        accentColor: accentColors[index % accentColors.count]
                    )
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("\(config.operation.rawValue) — \(problems.count)Q")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Toggle(isOn: $showAnswers) {
                    Label("Answers", systemImage: showAnswers ? "eye" : "eye.slash")
                }
                .toggleStyle(.button)
                .tint(showAnswers ? .green : .secondary)

                Button {
                    generateAndShare()
                } label: {
                    Label("Share PDF", systemImage: "square.and.arrow.up")
                }
            }
        }
        .sheet(item: $shareItem) { item in
            ShareSheet(activityItems: [item.url])
        }
    }

    private func generateAndShare() {
        let pdfData = PDFGenerator().generatePDF(
            problems: problems,
            config: config,
            showAnswers: showAnswers
        )
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("math-worksheet-\(config.operation.rawValue.lowercased()).pdf")
        try? pdfData.write(to: url)
        shareItem = ShareItem(url: url)
    }
}

struct ShareItem: Identifiable {
    let id = UUID()
    let url: URL
}

struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    }

    func updateUIViewController(_ uvc: UIActivityViewController, context: Context) {}
}
