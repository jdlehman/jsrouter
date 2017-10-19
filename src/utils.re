let hasLeadingSlash path => path |> Js.String.startsWith "/" |> Js.Boolean.to_js_boolean;

let ensureLeadingSlash path => {
    switch (path |> hasLeadingSlash |> Js.to_bool) {
    | true => path
    | false => "/" ^ path
    }
};

let hasTrailingSlash path => path |> Js.String.endsWith "/" |> Js.Boolean.to_js_boolean;

let ensureTrailingSlash path => {
    switch (path |> hasTrailingSlash |> Js.to_bool) {
    | true => path
    | false => path ^ "/"
    }
};

let pathFromHash url => {    
    let path = switch (url |> Js.String.split "#" |> Array.to_list) {
        | [_, b] => b
        | _  => "/"
    };
  path  
    |> ensureTrailingSlash
    |> ensureLeadingSlash;
};
  
let noop (): unit => ();
  
  /* let isFalse val => {
      val != Js.undefined && not Js.to_bool val;
  }; */

let trimQueryParams path => (Js.String.split "?" path).(0);

let sanitizedPaths paths queryParams => {
  paths 
  |> Js.Obj.keys
  |> Js.Array.reduce (fun sanitized key => {
    sanitized.[key] = trimQueryParams paths.[key];
    sanitized;
  }) (Js.Obj.empty ());
};
  /*
  
  function sanitizePaths(paths, queryParams) {
    const sanitizedPaths = {};
    Object.keys(paths).forEach(key => {
      sanitizedPaths[key] = trimQueryParams(paths[key]);
    });
    return sanitizedPaths;
  }
  
  export function getHandlers(allHandlers, recognizer, pathArgs, handlerName) {
    const recognizedHandlers = recognizer.recognize(pathArgs.path);
    if (!recognizedHandlers) { return null; }
    const handlers = [];
    const handlerArgs = {...sanitizePaths(pathArgs), queryParams: recognizedHandlers.queryParams};
    for (let i = 0; i < recognizedHandlers.length; i++) {
      const handlerData = recognizedHandlers[i];
      const params = handlerData.params;
      const handler = allHandlers[handlerData.handler];
      const handlerFunc = handler && handler[handlerName];
      const args = {...handlerArgs, params};
      handlers.push({handler: handlerFunc, args});
    }
    return handlers;
  }
  */

  type handler = {
      handler: Function,
      args: 'args
  };

  let callHandlers (handlers: array Handler) => {
      handlers |> Js.Array.forEach (fun handler args => handler args);
  };
  /*
  export function callHandlers(handlers) {
    handlers.forEach(({handler, args}) => {
      if (typeof handler === 'function') {
        handler(args);
      }
    });
  }
  
  export function getFlattenedHandlerArgs(handlers, startingArgs) {
    if (!handlers) { return startingArgs; }
    const args = handlers[0].args;
    const flattenedParams = handlers
      .reduce((mergedParams, {args: {params}}) => ({...mergedParams, ...params}), {});
    return {...args, params: flattenedParams};
  }
   */