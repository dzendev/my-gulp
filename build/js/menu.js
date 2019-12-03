(function() {
  var Animal, r, rr, x;
  x = 20;
  r = function() {
    return 320;
  };
  rr = () => {
    return 40;
  };
  Animal = class Animal {
    constructor(name) {
      this.name = name;
    }

    move(meters) {
      return console.log(this.name + 'moved');
    }

  };
})();

//# sourceMappingURL=menu.js.map
