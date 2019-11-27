let group = {
    title: "Our Group",
    students: ["John", "Pete", "Alice"],
    showList() {
        that = this
        this.students.forEach(function(student) {
        // Error: Cannot read property 'title' of undefined
        console.log(that.title + ': ' + student)
      });
    }
  };
  
  group.showList();

  let user = {}
  user.name = 'John'
  user.surname = "Smith"
  user.name = 'Pete'
  delete user.name
  console.log(user)