# Tauri + React + Typescript

This app use tauri to build a desktop application with React and Typescript.

## Purpose

This project is an utility app that allows to create, store personnal snippets of code.
The snippeds are categorized by a category (typically a programming language) and have simply have a title and a content.
It is meant to be a simple and lightweight alternative to more complex snippet managers.
It is also meant to be a good example of how to use Tauri with React and Typescript.

## Data storage

The data is stored under the APP_DATA_DIR directory, which is a platform-specific directory that is used to store application data.
The data is stored in a JSON file, which is read and written using the `fs` module from Tauri.
The data is stored in a simple format, with each snippet having a title, content, and category.
The file nae is `snippets.json`.

## Design, CSS

The CSS is written in a simple way, using CSS variables to define the colors and styles.
When suitable, use css modules to scope the styles to the component.

An approach by component is used, with each component having its own CSS file.
A main CSS file is used to define the global styles and variables.

## Dependencies

When suitable, dependencies will be used to simplify the development process.
It should be noted that the goal is to keep the dependencies to a minimum, so that the app remains lightweight and easy to maintain.
Explaination should be provided to explain why a dependency is very profitable.
