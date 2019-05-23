#!bin/bash

cd src/client
# run react build
yarn build
cd ../../

if test -d 'build'; then
  echo 'Removing existing build...'
  rm -r 'build'
fi

echo 'Moving new build...'
mv 'src/client/build' .