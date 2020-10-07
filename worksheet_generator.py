#!/usr/bin/env python
"""
A module for creating .pdf math worksheets
"""

__author__ = 'amit-bakhru'

import logging
from pathlib import Path
from random import choice, sample

import arrow
import click
import numpy as np
import weasyprint
from fpdf import FPDF
from rich.console import Console
from rich.logging import RichHandler
from rich.table import Table

TABLES_DICT = {'+': 'addition',
               '-': 'subtraction',
               'x': 'multiplication'}

RICH_COLOR_LIST = ["red",
                   "blue",
                   "green",
                   "yellow",
                   "cyan",
                   "bold red",
                   "bold blue",
                   "bold green",
                   "bold yellow",
                   "bold cyan",
                   "bright_red",
                   "bright_blue",
                   "bright_green",
                   "bright_yellow",
                   "bright_cyan"
                   ]
logging.basicConfig(level="INFO",
                    format="%(message)s",
                    datefmt="[%X]",
                    handlers=[RichHandler(rich_tracebacks=True)])
LOGGER = logging.getLogger("rich")
space_char = ' '


class WorkSheetGenerator:

    def __init__(self, type_: str, tables: bool, num_questions=90, start_num=1000, end_num=3000):
        self.final_questions_list = list()
        self.start_num = start_num
        self.end_num = end_num
        self.main_type = type_
        self.num_questions = num_questions
        self.tables = tables
        self.pdf = FPDF()
        self.console = Console(record=True, width=100)
        self.rich_color_choices = RICH_COLOR_LIST
        self.today_date = arrow.now().format('YYYY-MM-DD')
        self.data_dir = Path(__file__).parent.joinpath('data')
        self.data_dir.mkdir(exist_ok=True)
        fail_msg = f'Question of "{self.main_type}" type not supported'
        assert self.main_type in list(TABLES_DICT.keys()) + ['mix'], fail_msg
        self.generate_questions()

    def randomize_question(self):
        """randomize the questions and reduce the size to give 'num_questions' variable"""
        if len(self.final_questions_list) < self.num_questions:
            self.num_questions = len(self.final_questions_list)
        self.final_questions_list = sample(self.final_questions_list, self.num_questions)

    @staticmethod
    def chunks(lst, n):
        """splits the given lst into n number of parts"""
        return np.array_split(lst, len(lst) / n)

    @staticmethod
    def __calc_spaces(i, j):
        first_row_char_len = len([t for t in str(i)])
        second_row_char_len = len([t for t in str(j)])
        if first_row_char_len > 1:
            first_row_spaces = space_char * 1
        else:
            first_row_spaces = space_char * 2
        if second_row_char_len == first_row_char_len:
            first_row_spaces = space_char * 2
            sec_row_spaces = space_char * 1
        elif second_row_char_len < first_row_char_len:
            sec_row_spaces = space_char * (first_row_char_len - second_row_char_len)
        else:
            sec_row_spaces = space_char * 1
        return first_row_spaces, sec_row_spaces

    @staticmethod
    def __build_final_line(i, padding=2):
        first_row_char_len = len([t for t in str(i)])
        return "".join(["_" for _ in range(first_row_char_len + padding)])

    def print_final_worksheet(self, number_of_columns=9):
        LOGGER.info(f'Worksheet for Amaya : {len(self.final_questions_list)}')
        split_list = self.chunks(self.final_questions_list, number_of_columns)
        table = Table(show_header=False, header_style="bold magenta", padding=2)
        num_of_columns = len(split_list[0]) * 1
        for i in range(1, num_of_columns + 1):
            table.add_column(f'{i}')
        for i in range(num_of_columns):
            random_color = choice(self.rich_color_choices)
            table.columns[i].style = random_color

        for u in split_list:
            tmp = list(u)
            table.add_row(*tmp)
        self.console.print(table)
        if self.main_type == 'mix':
            _file_name = f'{self.main_type}-{self.today_date}.html'
        else:
            _file_name = f'{TABLES_DICT[self.main_type]}-{self.today_date}.html'
        final_file_path = self.data_dir / _file_name
        self.console.save_html(inline_styles=True, path=f'{final_file_path}')
        pdf = weasyprint.HTML(filename=final_file_path).write_pdf(stylesheets=['page.css'])
        final_file_path.with_suffix('.pdf').write_bytes(pdf)

    def generate_questions(self):
        if len(self.final_questions_list):
            self.final_questions_list = list()
        x_range = range(self.start_num, self.end_num + 1)
        y_range = range(self.start_num, self.end_num + 1)
        if self.main_type == 'x' and self.tables:
            y_range = range(2, 11)

        while len(self.final_questions_list) < self.num_questions:
            i = choice(x_range)
            j = choice(y_range)
            _type = self.main_type if self.main_type != 'mix' else choice(list(TABLES_DICT.keys()))
            first_row_spaces, second_row_spaces = self.__calc_spaces(i, j)
            tmp_equation = '\n'.join([f'{first_row_spaces}{i}',
                                      f'{_type}{second_row_spaces}{j}',
                                      f'{self.__build_final_line(i)}'
                                      ])
            self.final_questions_list.append(tmp_equation)
        LOGGER.debug(self.final_questions_list)
        self.randomize_question()
        self.print_final_worksheet()


@click.command()
@click.option('-t', '--type', default='+',
              type=click.Choice(['+', '-', 'x', 'mix']),
              multiple=False,
              help='type of calculation: '
                   '+: Addition; '
                   '-: Subtraction; '
                   'x: Multiplication; '
                   'mix: Mixed; '
                   '(default: +)')
@click.option('-q', '--questions', is_flag=False, default=90,
              help='Number of questions to generate')
@click.option('--start_num', is_flag=False, default=1000,
              help='Starting number for questions')
@click.option('--end_num', is_flag=False, default=3000,
              help='Ending number for questions')
@click.option('--tables', is_flag=True, default=True,
              help='Flag to disable tables and start double-digit multiply')
@click.help_option('-h', '--help')
def cli(type, questions, start_num, end_num, tables):
    WorkSheetGenerator(type, num_questions=questions,
                       start_num=start_num, end_num=end_num, tables=tables)


if __name__ == '__main__':
    cli()
