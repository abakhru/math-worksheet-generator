#!/usr/bin/env python

"""The setup script."""

from pathlib import Path

from setuptools import find_packages, setup

setup(
    author="Amit Bakhru",
    author_email='bakhru@me.com',
    python_requires='>=3.8',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
    ],
    description="Math worksheet genrator",
    install_requires=Path('requirements.txt').read_text().splitlines(),
    license="MIT license",
    long_description=Path('README.md').read_text(),
    include_package_data=True,
    keywords='math-worksheet-generator',
    name='math-worksheet-generator',
    packages=find_packages(),
    test_suite='test',
    url='https://github.com/abakhru/math-worksheet-generator',
    version='0.1.0',
    zip_safe=False,
)
