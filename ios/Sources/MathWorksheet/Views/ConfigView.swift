import SwiftUI

struct ConfigView: View {
    @State private var config = WorksheetConfig()
    @State private var problems: [MathProblem] = []
    @State private var navigateToWorksheet = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Operation") {
                    Picker("Type", selection: $config.operation) {
                        ForEach(WorksheetConfig.Operation.allCases) { op in
                            Text(op.rawValue).tag(op)
                        }
                    }
                    .pickerStyle(.segmented)
                    .listRowBackground(Color.clear)
                    .listRowInsets(.init())
                    .padding(.vertical, 4)
                }

                Section("Questions") {
                    Stepper("Count: \(config.questionCount)", value: $config.questionCount, in: 5...100, step: 5)
                }

                Section("Number Range") {
                    HStack {
                        Text("From")
                        Spacer()
                        TextField("Start", value: $config.startNum, format: .number)
                            .multilineTextAlignment(.trailing)
                            .keyboardType(.numberPad)
                            .frame(width: 80)
                    }
                    HStack {
                        Text("To")
                        Spacer()
                        TextField("End", value: $config.endNum, format: .number)
                            .multilineTextAlignment(.trailing)
                            .keyboardType(.numberPad)
                            .frame(width: 80)
                    }
                }

                if config.operation == .multiplication || config.operation == .mix {
                    Section {
                        Toggle("Multiplication tables mode (2–12)", isOn: $config.showTables)
                    } footer: {
                        Text("Restricts operands to the 2–12 times tables range.")
                    }
                }

                Section {
                    Button {
                        generate()
                    } label: {
                        Label("Generate Worksheet", systemImage: "doc.text.fill")
                            .frame(maxWidth: .infinity)
                            .font(.headline)
                    }
                    .buttonStyle(.borderedProminent)
                    .listRowBackground(Color.clear)
                    .listRowInsets(.init())
                    .padding(.vertical, 8)
                }
            }
            .navigationTitle("Math Worksheet")
            .navigationDestination(isPresented: $navigateToWorksheet) {
                WorksheetView(problems: problems, config: config)
            }
        }
    }

    private func generate() {
        problems = WorksheetGenerator().generate(config: config)
        navigateToWorksheet = true
    }
}

#Preview {
    ConfigView()
}
