const fs = require('fs');

import('lidy-js/parser/node_parse.js').then(({ preprocess }) => {
  preprocess('src/lidy/k8s.yaml');
  fs.writeFileSync(
    'src/lidy/k8s.js',
    fs.readFileSync('src/lidy/k8s.js', 'utf8')
      .replace("from '../parser/parse.js'", "from 'lidy-js';"),
  );
});
