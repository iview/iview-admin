var parser = window.parser,
    serializer = window.xmlserializer;

describe('xmlserializer', function () {

    var parseXML = function (xml) {
        return (new DOMParser()).parseFromString(xml, 'application/xml');
    };

    it("should not choke on null text node value", function () {
        var doc = document.implementation.createHTMLDocument("");
        doc.body.innerHTML = "Test content";

        expect(serializer.serializeToString(doc)).toMatch(/<title><\/title>/);
    });

    it("should output xmlns attributes for namespace changes", function () {
        var doc = document.implementation.createHTMLDocument("");
        var div = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
        var foreignObject =
            doc.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreignObject.appendChild(div);
        var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.appendChild(foreignObject);
        doc.body.appendChild(svg);

        expect(serializer.serializeToString(doc))
            .toMatch(/<body><svg xmlns="http:\/\/www.w3.org\/2000\/svg"><foreignObject><div xmlns="http:\/\/www.w3.org\/1999\/xhtml"( *\/>|><\/div>)<\/foreignObject><\/svg><\/body>/);
    });

    // This test should be moved to general tests
    it('should serialize a CDATA section', function () {
        var doc = parseXML('<html xmlns="http://www.w3.org/1999/xhtml"><head><script><![CDATA[escape that <]]></script></head></html>');

        expect(serializer.serializeToString(doc)).toEqual(
            '<html xmlns="http://www.w3.org/1999/xhtml"><head><script><![CDATA[escape that <]]></script></head></html>'
            );
    });

});
