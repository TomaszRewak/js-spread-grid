
## Docs

Documentation and examples can be found at [spread-grid.tomasz-rewak.com](https://spread-grid.tomasz-rewak.com/).

## About

Spread Grid is a javascript library that allows you to create high performance, customizable, and deeply interactive grid-based applications and visualizations with ease.

<p align="center">
    <a href="https://spread-grid.tomasz-rewak.com/examples/plotter">See live ↗</a>
</p>
<p align="center">
  <img src="https://github.com/TomaszRewak/js-spread-grid/blob/master/resources/screenshot.png?raw=true" width=800/>
</p>

The main focus of this library is to provide a simple and intuitive API that lets you create complex grid-based tools.

It's worth noting that the main goal of this library is efficiency, functionality, and performance. It's not necessarily intended for visually-rich and design-oriented applications. By principle it does not provide some of the bells and whistles that other libraries may do, like animations and transitions. Those features were traded off in favor of speed and performance - that are usually more important in case of heavy-duty internal-tooling applications. That being said, visually appealing applications can still be created with this library.

The ideal use-case for this framework is for creating data-dense tools that help users to monitor and interact with large amounts of data in real-time systems.

The main features of this library include:
- fast grid rendering
- cell styling
- selection
- multi-cell copying
- column and row resizing
- in-grid editing
- data sorting and filtering
- column and row pinning
- mouse-based grid interaction with easy cell identification

The full list of capabilities can be found in the following sections of the documentation.

You can explore the practical applications of this library by navigating to the examples section of the documentation. A good starting point would be the [App Manager](https://spread-grid.tomasz-rewak.com/examples/app-manager), [Heatmap](https://spread-grid.tomasz-rewak.com/examples/heatmap), or [Plotter](https://spread-grid.tomasz-rewak.com/examples/plotter) examples.

## State of the project

This project is currently in the beta stage. It's already quite stable and feature-rich, but there are still some features that are missing and some bugs that need to be fixed. I don't expect any major changes in the core API, though.

The code itself is currently in the "make it work" and "make it fast" stage. The "make it pretty" stage will come later.

## Running the project

After npm-installing individual sub-packages (`dash`, `docs`, `example`, `lib`, `react` and `tests`), you can start working on the project by running the `./workspaces.sh` command in the root directory.

It will create a `tmux` session with all the necessary processes running. It will also open a VSCode workspace with all the sub-packages opened.
