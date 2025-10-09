// https://mongoosejs.com/docs/promises.html#should-you-use-exec-with-await

import { ESLintUtils } from '@typescript-eslint/utils';

const mongooseQueryMethods = new Set([
  // Queries
  'deleteMany',
  'deleteOne',
  'find',
  'findById',
  'findByIdAndDelete',
  'findByIdAndRemove',
  'findByIdAndUpdate',
  'findOne',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'replaceOne',
  'updateMany',
  'updateOne',
  'aggregate',
  'exists',
  'countDocuments',
  'estimatedDocumentCount',

  // Query Method Chains
  '$where',
  'distinct',
  'lean',
  'orFail',
  'populate',
  'replaceOne',
  'transform',
  'select',
  'where',
]);

/** @type {import('eslint').Rule.RuleModule} */
export const mongooseUseExec = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the usage of ".exec" when awaiting a Mongoose model query',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      'no-exec': 'Awaiting a Mongoose model query without calling ".exec" is not allowed.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    return {
      AwaitExpression(node) {
        const callee = node.argument.callee;
        if (!callee || callee.type !== 'MemberExpression' || !mongooseQueryMethods.has(callee.property.name)) {
          return;
        }

        const services = ESLintUtils.getParserServices(context);
        const fnType = services.getTypeAtLocation(node.argument);

        const members = fnType.getProperties().map((sym) => sym.getName());
        if (!members || !members.includes('exec')) {
          return;
        }

        context.report({
          node,
          messageId: 'no-exec',
          fix: (fixer) => fixer.insertTextAfter(node, '.exec()'),
        });
      },
    };
  },
};
