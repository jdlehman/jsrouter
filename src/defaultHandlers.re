type router = Js.t {. navigate: string => unit}; 
external navigate: string => unit = "this.navigate" [@@bs.val];

let defaultUnrecognizedRouteHandler lastPath path => {
  navigate "/";
};

let defaultNavigateState () => {
  Js.Obj.empty ();
};
  