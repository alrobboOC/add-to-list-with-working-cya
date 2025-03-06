# Building a working HMRC 'Add to List' pattern
## Introduction
The HMRC ‘Add To List' pattern allows users to add more than one item to a list. Its great for capturing repeating data based on a specific topic. It follows a standard flow which can be repeated multiple times to build the full picture. I have personally used this pattern across many government departments and although some departments have slightly differing patterns, the HMRC version is often seen as the benchmark.

This is a more advanced how-to guide to demonstrate how to build a working version of the pattern within your prototype.

## The techniques we’ll use
We’ll use a number of techniques that may feel a little complicated but hopefully we can explain them as we go. Heres a quick glossary of terms that we’ll cover in detail during this exercise.

### Storing Data
**Arrays**
An array can hold multiple values
`cars = ["Saab", "Volvo", "BMW"];`

**Objects**
An object has properties. Data is stored as a matched pair ‘property name’ and ‘property value’. You have to remember that property names are case sensitive.
`car = {make: "Ford", model: ”Transit", cc: "2500”};`

**An array of objects (multi-dimensional array)**
We can combine the two methods to build our own data model
`cars = [{make: "Ford", model: ”Transit", cc: "2500”}, {make: ”Smart", model: ”451", cc: ”700”}];`

This might sound complicated concept but image this as a table:
