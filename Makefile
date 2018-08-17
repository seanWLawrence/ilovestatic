lint:
	prettier-eslint --config .prettierrc.js --eslint-config-path .eslintrc.js --write  \"packages/src/**.js\"

test: 
	jest

commit:
	lerna-semantic-release pre
	lerna-semantic-release perform
	lerna-semantic-release post