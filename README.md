### Simple CLI application to generate mathematics worksheet for the following operations

- addition worksheet
- subtraction worksheet
- multiplication worksheet
- can specify to generate variable number of questions
- all three worksheets can be generated together
- saves the generated worksheet in colored HTML file
- Randomized questions always, so its never the same set of questions

### To Run
```
./quick_start.sh
```

# Usage
```
python worksheet_generator.py --help
Usage: worksheet_generator.py [OPTIONS]

Options:
  -s, --subtract           Generate subtraction worksheet
  -a, --add                Generate addition worksheet
  -m, --multiply           Generate multiplication worksheet
  -n, --questions INTEGER  Number of questions to generate
  --help                   Show this message and exit.
```

### TODO
- [ ] division worksheet
- [ ] support to generate answer key for the related worksheet
- [ ] auto-evaluate and score the answer sheet based on hand-writing recognition model
- [ ] support for start and end values as cli arguments1