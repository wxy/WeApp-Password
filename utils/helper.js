function  inArray(needle, haystack) {
    /**
     * inArray 源自 Jquey
     */
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i].secret == needle) return true;
    }
    return false;
  }

  module.exports.inArray = inArray;