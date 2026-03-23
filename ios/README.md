# Math Worksheet — iOS App

SwiftUI app that generates printable math worksheets. Pure native, no backend needed.

## Setup

```bash
brew install xcodegen
cd ios
xcodegen generate
open MathWorksheet.xcodeproj
```

Then select a simulator or device and press **Run**.

## Features

- Addition, Subtraction, Multiplication, or Mix
- Configurable question count (5–100) and number range
- Multiplication tables mode (2–12 operands)
- Answer key toggle (show/hide on screen)
- Export worksheet as PDF → share or AirPrint

## Project layout

```
Sources/MathWorksheet/
  App.swift                    # @main entry point
  Models/
    WorksheetConfig.swift      # configuration model
    MathProblem.swift          # single problem model
  Services/
    WorksheetGenerator.swift   # random problem generation
    PDFGenerator.swift         # UIGraphicsPDFRenderer output
  Views/
    ConfigView.swift           # home screen / settings form
    WorksheetView.swift        # grid of problems + share button
    ProblemCell.swift          # single vertical-format problem card
```
