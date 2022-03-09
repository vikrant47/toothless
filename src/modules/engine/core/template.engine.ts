import * as expEval from 'expression-eval';

export class TemplateEngine {
  static evalString(expression, context) {
    const parsed = expEval.parse(expression); // abstract syntax tree (AST)
    return expEval.eval(parsed, context); // 2.4
  }

  /** Evaluate expression inside ${exp}*/
  static evalExpression(expression, context) {
    expression = expression.trim();
    if (expression.startsWith('${') && expression.endsWith('}')) {
      return this.evalString(
        expression.substring(2, expression.length - 1),
        context
      );
    }
    return expression;
  }

  /**
   * this will walk on the path and will return the underlying object
   * e.g.
   * 1 - TemplateEngine.walk('x.y',{x:{y:10}}) will return {value:10}
   * 2 - TemplateEngine.walk('x.y',{x:{y:10}},-1) will return {value:{y:10},prop:'y'}
   * */
  static walk(path, context, depth = 0) {
    if (depth !== 0) {
      const edges = path.split('.');
      const spliced = edges.splice(depth * -1);
      path = edges.join('.');
      return { value: this.evalString(path, context), prop: spliced.join('.') };
    }
    return { value: this.evalString(path, context) };
  }
}
