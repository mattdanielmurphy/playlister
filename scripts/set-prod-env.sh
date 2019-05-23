#!bin/bash
echo 'Setting production environment...'

# only convert files if not already converted; if production version exists
if test -f "${BASH_SOURCE%/*}/../src/index-p.js"; then
  echo 'Replacing files...'
  
  # replace client-env
  mv "${BASH_SOURCE%/*}/../src/client/src/client-env.js" "${BASH_SOURCE%/*}/../src/client/src/client-env-d.js"
  mv "${BASH_SOURCE%/*}/../src/client/src/client-env-p.js" "${BASH_SOURCE%/*}/../src/client/src/client-env.js"

  # replace server-env
  mv "${BASH_SOURCE%/*}/../src/server-env.js" "${BASH_SOURCE%/*}/../src/server-env-d.js"
  mv "${BASH_SOURCE%/*}/../src/server-env-p.js" "${BASH_SOURCE%/*}/../src/server-env.js"

  # replace server index
  mv "${BASH_SOURCE%/*}/../src/index.js" "${BASH_SOURCE%/*}/../src/index-d.js"
  mv "${BASH_SOURCE%/*}/../src/index-p.js" "${BASH_SOURCE%/*}/../src/index.js"
else
  echo 'No files to replace.'
fi