#!bin/bash
echo 'Setting development environment...'

# only convert files if not already converted; if development version exists
if test -f "${BASH_SOURCE%/*}/../src/index-d.js"; then
  echo 'Replacing files...'

  # replace client-env
  mv "${BASH_SOURCE%/*}/../src/client/src/client-env.js" "${BASH_SOURCE%/*}/../src/client/src/client-env-p.js"
  mv "${BASH_SOURCE%/*}/../src/client/src/client-env-d.js" "${BASH_SOURCE%/*}/../src/client/src/client-env.js"

  # replace server-env
  mv "${BASH_SOURCE%/*}/../src/server-env.js" "${BASH_SOURCE%/*}/../src/server-env-p.js"
  mv "${BASH_SOURCE%/*}/../src/server-env-d.js" "${BASH_SOURCE%/*}/../src/server-env.js"

  # replace server index
  mv "${BASH_SOURCE%/*}/../src/index.js" "${BASH_SOURCE%/*}/../src/index-p.js"
  mv "${BASH_SOURCE%/*}/../src/index-d.js" "${BASH_SOURCE%/*}/../src/index.js"
else
  echo 'No files to replace.'
fi