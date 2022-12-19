import('lidy-js/parser/node_parse.js').then(({ preprocess }) => {
  preprocess('src/lidy/k8s.yml');
});
