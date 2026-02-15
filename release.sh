#!/bin/bash

version=$1

function update_package_json() {
    local package=$1
    local version=$2

    echo "-----> Updating $package to version $version"

    cd $package
    npm version $version
    cd ..
}

function update_docs_version() {
    local version=$(node -p "require('./lib/package.json').version")

    echo "-----> Updating docs version display to $version"

    sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$version/" docs/src/App.js
}

function release_dash_package() {
    local package=$1

    echo "-----> Releasing $package"

    cd $package
    . venv/bin/activate
    npm run build
    rm -r ./dist
    python3 setup.py sdist bdist_wheel
    twine upload dist/*
    deactivate
    cd ..
}

function release_js_package() {
    local package=$1

    echo "-----> Releasing $package"

    cd $package
    npm pkg set main="dist/index.js"
    npm run build
    npm publish --access public
    npm pkg set main="src/index.js"
    cd ..
}

function publish_application() {
    local application=$1

    echo "-----> Publishing $application"

    cd $application
    npm run build
    rsync -r --delete ./build/ $WEBSITE_USER@$WEBSITE_HOST:~/domains/spread-grid.tomasz-rewak.com/public_nodejs/public
    cd ..
}

packages=(
    "lib"
    "react"
    "dash"
)

applications=(
    "docs"
)

js_packages=(
    "lib"
    "react"
)

dash_packages=(
    "dash"
)

for package in ${packages[@]}; do
    update_package_json $package $version
done

update_docs_version

for package in ${js_packages[@]}; do
    release_js_package $package
done

for package in ${dash_packages[@]}; do
    release_dash_package $package
done

for application in ${applications[@]}; do
    publish_application $application
done
