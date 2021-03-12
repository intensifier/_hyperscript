describe("the set command", function() {

    beforeEach(function () {
        clearWorkArea();
    });
    afterEach(function () {
        clearWorkArea();
    });

    it("can set properties", function(){
        var d1 = make("<div id='d1' _='on click set #d1.innerHTML to \"foo\"'></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set indirect properties", function(){
        var d1 = make("<div id='d1' _='on click set innerHTML of #d1 to \"foo\"'></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set complex indirect properties lhs", function(){
        var d1 = make("<div _='on click set parentNode.innerHTML of #d1 to \"foo\"'><div id='d1'></div></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set complex indirect properties rhs", function(){
        var d1 = make("<div _='on click set innerHTML of #d1.parentNode to \"foo\"'><div id='d1'></div></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set chained indirect properties", function(){
        var d1 = make("<div _='on click set the innerHTML of the parentNode of #d1 to \"foo\"'><div id='d1'></div></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set styles", function(){
        var d1 = make("<div _='on click set my.style.color to \"red\"'>lolwat</div>");
        d1.click();
        d1.style.color.should.equal("red");
    })

    it("can set javascript globals", function(){
        try {
            var d1 = make("<div _='on click set window.temp to \"red\"'>lolwat</div>");
            d1.click();
            window['temp'].should.equal("red");
        } finally {
            delete window.temp
        }
    })

    it("can set local variables", function(){
        var d1 = make("<div id='d1' _='on click set newVar to \"foo\" then" +
            "                                    put newVar into #d1.innerHTML'></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set into id ref", function(){
        var d1 = make("<div id='d1' _='on click set #d1.innerHTML to \"foo\"'></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
    })

    it("can set into class ref", function(){
        var d1 = make("<div class='divs' _='on click set .divs.innerHTML to \"foo\"'></div>");
        var d2 = make("<div class='divs''></div>");
        d1.click();
        d1.innerHTML.should.equal("foo");
        d2.innerHTML.should.equal("foo");
    })

    it("set waits on promises", function(done){
        window.promiseAString = function(){
            return new Promise(function(finish){
                window.finish = finish;
            });
        }
        try {
            var d1 = make("<div id='d1' _='on click set #d1.innerHTML to promiseAString()'></div>");
            d1.click();
            d1.innerHTML.should.equal("");
            finish("foo");
            setTimeout(function () {
                d1.innerHTML.should.equal("foo");
                done();
            }, 20);
        } finally {
            delete window.promiseAString;
            delete window.finish;
        }
    })

	it("can set many properties at once with object literal", function() {
		window.obj = {foo: 1};
		make("<div _='on click set {bar: 2, baz: 3} on obj'></div>").click();
		obj.should.deep.equal({foo: 1, bar: 2, baz: 3});
		delete window.obj;
	})

});

