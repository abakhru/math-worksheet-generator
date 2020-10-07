#!/usr/bin/env python
import logging
from random import choice, sample

import arrow
import click
import numpy as np
from rich.console import Console
from rich.logging import RichHandler
from rich.table import Table

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
logging.basicConfig(level="DEBUG",
                    format="%(message)s",
                    datefmt="[%X]",
                    handlers=[RichHandler(rich_tracebacks=True)])
LOGGER = logging.getLogger("rich")
space_char = ' '


class WorkSheetGenerator:

    def __init__(self, num_questions=90):
        self.final_questions_list = list()
        self.num_questions = num_questions
        self.console = Console(record=True, width=100)
        self.rich_color_choices = RICH_COLOR_LIST
        self.today_date = arrow.now().format('YYYY-MM-DD')

    def randomize_question(self):
        """randomize the questions and reduce the size to give 'num_questions' variable"""
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

    def print_final_worksheet(self, ops='add', number_of_columns=9):
        LOGGER.info(f'Worksheet for Amaya : {len(self.final_questions_list)}')
        split_list = self.chunks(self.final_questions_list, number_of_columns)
        table = Table(show_header=False, header_style="bold magenta", padding=2)
        num_of_columns = len(split_list[0]) * 1
        for i in range(1, num_of_columns + 1):
            table.add_column(f'{i}')
        # self.console.print(table)
        for i in range(num_of_columns):
            random_color = choice(self.rich_color_choices)
            # LOGGER.debug(f'Random Color Choice for {i} index: {random_color}')
            table.columns[i].style = random_color

        for u in split_list:
            tmp = list(u)
            table.add_row(*tmp)
        self.console.print(table)
        self.console.save_html(inline_styles=True, path=f'{ops}-{self.today_date}.html')

    def multiplication_tables_worksheet(self, multiplicand=12, multiplier=10):
        if len(self.final_questions_list):
            self.final_questions_list = list()
        for i in range(1, multiplicand):
            for j in range(multiplier):
                tmp_equation = f'{i} x {j} = {self.__build_final_line(i, padding=1)}'
                self.final_questions_list.append(tmp_equation)
        self.randomize_question()
        self.print_final_worksheet(ops='multiplication')

    def addition_tables_worksheet(self, add_start=1000, add_end=2000, symbol='+', ops='addition'):
        if len(self.final_questions_list):
            self.final_questions_list = list()
        for i in range(add_start, add_end + 1):
            for j in range(add_end):
                first_row_spaces, second_row_spaces = self.__calc_spaces(i, j)
                tmp_equation = '\n'.join([f'{first_row_spaces}{i}',
                                          f'{symbol}{second_row_spaces}{j}',
                                          f'{self.__build_final_line(i)}'
                                          ])
                self.final_questions_list.append(tmp_equation)
        self.randomize_question()
        self.print_final_worksheet(ops=ops)

    def subtraction_tables_worksheet(self, sub_start=1, sub_end=10):
        self.addition_tables_worksheet(sub_start, sub_end, symbol='-', ops='subtract')


@click.command()
@click.option('-s', '--subtract', is_flag=True, default=False,
              help='Generate subtraction worksheet')
@click.option('-a', '--add', is_flag=True, default=False,
              help='Generate addition worksheet')
@click.option('-m', '--multiply', is_flag=True, default=False,
              help='Generate multiplication worksheet')
@click.option('-n', '--questions', is_flag=False, default=90,
              help='Number of questions to generate')
def cli(add, subtract, multiply, questions):
    p = WorkSheetGenerator(num_questions=questions)
    if multiply:
        p.multiplication_tables_worksheet()
    if add:
        p.addition_tables_worksheet(add_start=1, add_end=10)
    if subtract:
        p.subtraction_tables_worksheet(sub_start=1000, sub_end=2000)


if __name__ == '__main__':
    cli()
