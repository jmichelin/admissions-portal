//
// This file is imported as a sandbox script.
// This is done in client/code-editor/lib/sandbox.js
//
function runTests (event) {

  var sandbox = {};
  var sandboxProperties = ['myArray', 'cutName', 'myInfo'];
  var calledShowApp = false;
  var Admissions = {
    showApp: function() { calledShowApp = true; }
  };

  try {
    var sandboxValues = challengeSubmission(Admissions, sandboxProperties);
    sandboxProperties.forEach(function (prop, i) {
      sandbox[prop] = sandboxValues[prop]
    })
  }
  catch (e) {
    postMessage({
      type: 'runtime_error',
      error: { name: e.name, message: e.message, trace: e.stack },
      trace: printStackTrace({ e: e }),
    });
    postMessage('__terminate__');
    return;
  }

  var testResults = assessments.map(function(assessment, i) {
    try {
      assessment.test(sandbox);
      return { name: assessment.name, passing: true }
    }
    catch (e) {
      return {
        name: assessment.name,
        passing: false,
        error: { name: e.name, message: e.message, testCaseIndex: i },
        trace: printStackTrace({ e: e }),
      }
    }
  });

  postMessage({
    type: 'test_results',
    tests: testResults,
    showApp: calledShowApp,
    // Web workers cannot send functions via postMessage.
    myInfo: removeFunctions(sandbox.myInfo)
  });

  postMessage('__terminate__')

  function removeFunctions(x) {
    try {
      return JSON.parse(JSON.stringify(x));
    } catch (e) {
      // Will happen when x is a function or undefined, since JSON.parse
      // fails to parse "undefined"
      return null;
    }
  }
};


var assessments = [
  {
    name: 'myArray is defined as an array',
    test: function myArrayIsDefined ( sandbox ) {
      expect( sandbox.myArray ).to.not.be( undefined );
      expect( sandbox.myArray ).to.be.an( 'array' );
      return true;
    }
  },
  {
    name: "myArray has two strings",
    test: function myArrayHasTwoStrings ( sandbox ) {
      expect( sandbox.myArray ).to.have.length( 2 );
      expect( sandbox.myArray[0] ).to.be.a( 'string' );
      expect( sandbox.myArray[1] ).to.be.a( 'string' );
      return true;
    }
  },
  {
    name: "cutName is defined as a function",
    test: function cutNameExists ( sandbox ) {
        expect( sandbox.cutName ).to.be.defined;
        expect( sandbox.cutName ).to.be.a( 'function' );
      return true;
    }
  },
  {
    name: "cutName splits strings",
    test: function cutNameWorks ( sandbox ) {
      expect( sandbox.cutName( 'Bob Bobson' ) ).to.eql( ['Bob', 'Bobson'] );
      expect( sandbox.cutName( 'Romeo Alpha Nancy Delta' ) ).to.eql( ['Romeo', 'Alpha', 'Nancy', 'Delta'] );
      return true;
    }
  },
  {
    name: "myInfo is defined as an object",
    test: function myInfoExists ( sandbox ) {
      expect( sandbox.myInfo ).to.be.defined;
      expect( sandbox.myInfo ).to.be.an( 'object' );
      expect( sandbox.myInfo ).not.to.be.an( 'array' );
      return true;
    }
  },
  {
    name: "myInfo.fullName is the same as cutName(myArray[0])",
    test: function myInfoFullNameMatchesCutName ( sandbox ) {
      expect( sandbox.myInfo.fullName ).to.eql( sandbox.cutName( sandbox.myArray[0] ) );
      return true;
    }
  },
  {
    name: "myInfo.favoriteColor should equal myArray[1]",
    test: function myDataFavoriteColorMatchesMyArray ( sandbox ) {
      expect( sandbox.myInfo.favoriteColor ).to.eql( sandbox.myArray[1] );
      expect( sandbox.myInfo.favoriteColor ).to.be.an( 'string' );
      return true;
    }
  },
  {
    name: 'myInfo.github is defined as a string or null',
    test: function ( sandbox ) {
      expect( sandbox.myInfo ).to.be.defined;
      expect( sandbox.myInfo.github ).to.be.defined;

      var github = sandbox.myInfo.github;
      var githubOk = (typeof github === 'string' || github === null);
      expect( githubOk ).to.be.ok();

      return true;
    }
  }
]


runTests()
