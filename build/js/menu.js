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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgdmFyIEFuaW1hbCwgciwgcnIsIHg7XG4gIHggPSAyMDtcbiAgciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAzMjA7XG4gIH07XG4gIHJyID0gKCkgPT4ge1xuICAgIHJldHVybiA0MDtcbiAgfTtcbiAgQW5pbWFsID0gY2xhc3MgQW5pbWFsIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIG1vdmUobWV0ZXJzKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5uYW1lICsgJ21vdmVkJyk7XG4gICAgfVxuXG4gIH07XG59KSgpO1xuIl0sImZpbGUiOiJtZW51LmpzIn0=
