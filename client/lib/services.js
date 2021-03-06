/**
 * Created by Andrea on 28/07/2015.
 */
angular.module('sam-1').service("notificationService", function($mdToast){
    this.showError = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
            hideDelay: 3000,
            position: 'bottom right'
        });
    }
    this.showSuccess = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast success">' + msg + '</md-toast>',
            hideDelay: 3000,
            position: 'bottom right'
        });
    }
});

angular.module('sam-1').service("ProfileService", function($rootScope) {

    this.getRol = function() {
        return $rootScope.currenUser.roles;
    };
    this.getModules = function() {

    }
});

angular.module('sam-1').service("TextEvaluatorService", function() {

    this.getTextEvenIfNullOrUndef = function(text) {
        if(typeof(text) == 'undefined' || text == null){
          text = "";
        }
        return text;
    };
});

angular.module('sam-1').service("AuthorizationService", function(){
    this.showError = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
    this.showSuccess = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast success">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
});

angular.module('sam-1').service("ModalService", function($mdDialog){
    this.showModal = function(controller, urlTemplate, event) {
        $mdDialog.show({
            controller: controller,
            templateUrl: urlTemplate,
            targetEvent : event
        });
    }

    this.showModalWithParams = function(controller, urlTemplate, event, params) {
        $mdDialog.show({
            controller: controller,
            templateUrl: urlTemplate,
            targetEvent : event,
            locals: params
        });
    }

    this.showConfirmDialog = function(title, content, okTitle, cancelTitle, event, onCancel, onConfirm) {
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title(title)
      .content(content)
      .ariaLabel(title)
      .ok(okTitle)
      .cancel(cancelTitle)
      .targetEvent(event);
      $mdDialog.show(confirm).then(onConfirm, onCancel);
    }

    this.showAlertDialog = function(title, message, confirm) {
      $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .content(message)
        .ariaLabel('Mensaje de alerta')
        .ok(confirm)
    );
    }

});

angular.module('sam-1').service("DateService", function(){
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
  this.dateAsLiteral = function(date){
    var text = "";
    if(!!date){
      text = diasSemana[date.getDay()] + ", " + date.getDate() + " de " + meses[date.getMonth()] + " de " + date.getFullYear();
    }
    return text;
  }
});

angular.module('sam-1').service("RangeEvaluator", function(RANGE_EVALUATOR, $meteor){
    var equalEval = function(val, range){
      var detail = {result:"Fuera de rango", correct:false};
      var i = 0;
      var found = false;
      while(i<range.fields.length && !found){
        if(range.fields[i].name == "valor"){
          found = true;
          var equalValue = range.fields[i].value;
          if(equalValue == val){
            detail.result = range.name;
            detail.correct = true;
          }
        }
        i++;
      }
      return detail;
    }

    var betweenEval = function(val, range){
      var detail = {result:"Fuera de rango", correct:false};
      var i = 0;
      var initial = 0;
      var final = 0;
      var foundInitial = false;
      var foundFinal = false;
      while(i<range.fields.length && !foundInitial){
        if(range.fields[i].name == "inicial"){
          foundInitial = true;
          initial = range.fields[i].value;
        }
        i++;
      }
      i = 0;
    while(i<range.fields.length && !foundFinal){
        if(range.fields[i].name == "final"){
          foundFinal = true;
          final = range.fields[i].value;
        }
        i++;
    }

    if(initial != undefined && final!= undefined){
        if((val<=final) && (val>=initial)){
          detail.result = range.name;
          detail.correct = true;
        }
    }

    return detail;
    }


    this.evaluatorsMap = {};
    this.evaluatorsMap['Igual'] = equalEval;
    this.evaluatorsMap['Entre'] = betweenEval;
});


angular.module('sam-1').service("PrintService", function(){
    this.printRoles = function(roles) {
      var text = "<tr><th>Nro</th><th>Nombre</th></tr>";
      var counter = 1;
      angular.forEach(roles, function(rol){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+rol.name+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de roles", text);
    }

    this.printUsers = function(users) {
      var text = "<tr><th>Nro</th><th>Nombre de usuario</th><th>Nombre</th><th>Apellido</th><th>Rol</th></tr>";
      var counter = 1;
      angular.forEach(users, function(user){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+user.username+"</td>";
        text+="<td>"+user.profile.name+"</td>";
        text+="<td>"+user.profile.lastName+"</td>";
        text+="<td>"+user.rol+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de usuarios", text);
    }
    this.printModules = function(modules) {
      var text = "<tr><th>Nro</th><th>Nombre</th><th>Roles</th></tr>";
      var counter = 1;
      angular.forEach(modules, function(module){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+module.name+"</td>";
        text+="<td>";
        module.rolesObj.forEach(function(rol){
          text+=rol.name+"<br>";
        })
        text+="</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de modulos", text);
    }

    this.printAttentions = function(attentions) {
      var text = "<tr><th>Nro</th><th>Nombre</th></tr>";
      var counter = 1;
      angular.forEach(attentions, function(attention){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+attention.name+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de tipos de atencion", text);
    }

    this.printServices = function(services) {
      var text = "<tr><th>Nro</th><th>Nombre</th></tr>";
      var counter = 1;
      angular.forEach(services, function(service){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+service.name+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de servicios", text);
    }

    this.printDoctors = function(doctors) {
      var text = "<tr><th>Nro</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th>Matricula</th></tr>";
      var counter = 1;
      angular.forEach(doctors, function(doctor){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+doctor.name+"</td>";
        text+="<td>"+doctor.lastName+"</td>";
        text+="<td>"+doctor.especialism+"</td>";
        text+="<td>"+doctor.enrolment+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de doctores", text);
    }

    this.printDoctors = function(doctors) {
      var text = "<tr><th>Nro</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th>Matricula</th></tr>";
      var counter = 1;
      angular.forEach(doctors, function(doctor){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+doctor.name+"</td>";
        text+="<td>"+doctor.lastName+"</td>";
        text+="<td>"+doctor.especialism+"</td>";
        text+="<td>"+doctor.enrolment+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de doctores", text);
    }

    this.printPatients = function(patients) {
      var text = "<tr><th>Nro</th><th>Apellido</th><th>Nombre</th><th>CI</th></tr>";
      var counter = 1;
      angular.forEach(patients, function(patient){
        text+="<tr>";
        text+="<td>"+counter+"</td>";
        text+="<td>"+patient.lastName+"</td>";
        text+="<td>"+patient.name+"</td>";
        text+="<td>"+patient.ci+"</td>";
        text+="</tr>";
        counter++;
      });
      this.printTableWithText("Reporte de pacientes", text);
    }


    this.printTableWithText = function(title,text){
      var newWin= window.open("");
      newWin.document.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><style type='text/css'>table {width:100%} table, th, td {border: 1px solid black;}</style></head><body>");
      newWin.document.write("<h2>"+title+"</h2>");
      newWin.document.write("<table>");
      newWin.document.write(text);
      newWin.document.write("</table>");
      newWin.document.write("</body></html>");
      newWin.print();
      newWin.close();
    }
});
