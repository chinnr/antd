#!/bin/bash
rm -rf dist/
# 解压
echo "解压"
tar -zxvf dist.tar.gz
echo "复制"
cp -r dist /data/www/dev.bldsnapp.com.new
cd /data/www/
mv dev.bldsnapp.com dev.bldsnapp.com.old
mv dev.bldsnapp.com.new dev.bldsnapp.com

# 修改权限
chown -R nginx:nginx *
echo "操作成功"
