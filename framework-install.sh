### Install framework packages ###
echo 'Installing framework'
rm -rf pnpm-lock.yaml
rm -rf node_modules
pnpm store prune
pnpm i --shamefully-hoist -r  || (echo 'Cannot install framework packages' && exit)
pnpm run link || (echo 'Cannot link framework packages' && exit)