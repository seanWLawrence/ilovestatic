lint:
	prettier-eslint --config .prettierrc.js --eslint-config-path .eslintrc.js --write  \"packages/src/**.js\"

test: 
	jest

commit:
	git-cz

lerna-bootstrap:
	npx lerna bootsrap