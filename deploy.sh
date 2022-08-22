#!/usr/bin/env sh

set -e
rm -rf dist
pnpm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git branch -M main
git remote add origin git@github.com:heycn/plum-website.git
git push -f -u origin main
cd -
echo -e "\033[36m部署完毕 \033[0m"
echo -e "\033[36m仓库地址: https://github.com/heycn/plum-website \033[0m"
echo -e "\033[36m预览地址: https://heycn.github.io/plum-website \033[0m"