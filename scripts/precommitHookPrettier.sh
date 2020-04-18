if [ "$LJN_PRETTIER_STRATEGY" != "check" ]; then
  node_modules/prettier/bin-prettier.js "*/**/*.js" --ignore-path ./.prettierignore --write && git add . && git status
else
  node_modules/prettier/bin-prettier.js "*/**/*.js" --ignore-path ./.prettierignore --check
fi