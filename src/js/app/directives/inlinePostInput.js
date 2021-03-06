module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      community: '=',
      project: '='
    },
    controller: function ($scope) {
      'ngInject'

      $scope.communities = $scope.community ? [$scope.community] : []

      $scope.expand = function () {
        $scope.expanded = true
      }

      $scope.$on('post-editor-done', () => {
        $scope.expanded = false
      })
    },
    templateUrl: '/ui/post/inline-edit.tpl.html',
    replace: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        if (!scope.expanded) {
          scope.$apply(() => scope.expanded = true)
        }
      })

      scope.$on('open-post-editor', () => {
        scope.expand()
        element.find('input')[0].focus()
      })

      scope.$watch('expanded', val => {
        if (val) {
          element.addClass('expanded')
        } else {
          element.removeClass('expanded')
        }
      })
    }
  }
}
