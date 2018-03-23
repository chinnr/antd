#!/bin/bash
# 打包 tar -zcvf dist.tar.gz dist
# scp dist.tar.gz yichui@119.29.182.64:~/alan/
# 解压  tar -zxvf dist.tar.gz

# 复制到目录
# cp -r dist/* /data/www/dev.bldsnapp.com/
# /data/www/dev.bldsnapp.com.new/
# mv /data/www/dev.bldsnapp.com /data/www/dev.bldsnapp.com.old
# mv /data/www/dev.bldsnapp.com.new /data/www/dev.bldsnapp.com
# 修改权限
# chown -R nginx:nginx *


echo "开始编译......"
yarn build
echo "成功编译编译 !"
echo "开始打包......"
tar -zcvf dist.tar.gz dist
echo "打包成功 !"
echo "上传文件......"
scp dist.tar.gz yichui@119.29.182.64:~/alan/
echo "上传文件成功"
