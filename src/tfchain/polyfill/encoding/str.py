from tfchain.polyfill.encoding.jsmods.sprintfjs import api as sprintfjs

def to_int(str, base=None):
    x = None
    __pragma__("js", "{}", """
    x = parseInt(str, base);
    """)
    return x

def from_int(x):
    str = None
    __pragma__("js", "{}", """
    str = x.toString();
    """)
    return str

def to_utf8(str):
    bytes = None
    __pragma__("js", "{}", """
    bytes = new TextEncoder("utf-8").encode(str);
    """)
    return bytes

def from_utf8(bytes):
    str = None
    __pragma__("js", "{}", """
    str = new TextDecoder().decode(bytes);
    """)
    return str

def zfill(s, n):
    if len(s) >= n:
        return s
    n -= len(s)
    __pragma__("js", "{}", """
    s = '0'.repeat(n) + s
    """)
    return s

def lower(s):
    __pragma__("js", "{}", """
    s = s.toLowerCase();
    """)
    return s

def upper(s):
    __pragma__("js", "{}", """
    s = s.toUpperCase();
    """)
    return s

def rescape(s):
    __pragma__("js", "{}", """
    s = s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    """)
    return s

def strip(s, c=None):
    if c:
        if not isinstance(c, str):
            c = ''.join(c)
        c = rescape(c)
        __pragma__("js", "{}", """
        s = s.replace(new RegExp('[' + c + ']+', 'gi'), '');
        """)
    else:
        __pragma__("js", "{}", """
        s = s.trim();
        """)
    return s

def lstrip(s, c=None):
    if c:
        if not isinstance(c, str):
            c = ''.join(c)
        c = rescape(c)
        __pragma__("js", "{}", """
        s = s.replace(new RegExp('^[' + c + ']+', 'i'), '');
        """)
    else:
        __pragma__("js", "{}", """
        s = s.trimLeft();
        """)
    return s

def rstrip(s, c=None):
    if c:
        if not isinstance(c, str):
            c = ''.join(c)
        c = rescape(c)
        __pragma__("js", "{}", """
        s = s.replace(new RegExp('[' + c + ']+$', 'i'), '');
        """)
    else:
        __pragma__("js", "{}", """
        s = s.trimRight();
        """)
    return s

def replace(s, sub_old, sub_new):
    __pragma__("js", "{}", """
    s = s.replace(sub_old, sub_new);
    """)
    return s

def sprintf(fmt, *argv):
    return sprintfjs(fmt, *argv)

def split(s, c=None):
    c = c or ''
    if not isinstance(c, str):
        raise TypeError("c is expected to be a str, not be of type {}".format(c))
    arr = None
    __pragma__("js", "{}", """
    arr = s.split(c);
    """)
    return arr

def repeat(s, count):
    if not isinstance(s, str):
        raise TypeError("s has to be a str, not be of type {}".format(type(s)))
    out = None
    __pragma__("js", "{}", """
    out = s.repeat(count);
    """)
    return out

def contains(s, sub):
    if not isinstance(s, str):
        raise TypeError("s has to be a str, not be of type {}".format(type(s)))
    if not isinstance(sub, str):
        raise TypeError("sub has to be a str, not be of type {}".format(type(sub)))
    result = False
    __pragma__("js", "{}", """
    result = s.includes(sub);
    """)
    return result

class String:
    """
    Utility class to provide pythonic functions on javascript strings.
    """

    @classmethod
    def from_utf8(cls, b):
        return cls(from_utf8(b))

    def __init__(self, str=None):
        self._str = str or ""

    @property
    def value(self):
        return self._str

    def __eq__(self, other):
        if isinstance(other, String):
            return self.__eq__(other.value)
        return self.value == other
    def __ne__(self, other):
        return not self.__eq__(other)

    def strip(self):
        return String(strip(self.value))

    def lstrip(self):
        return String(lstrip(self.value))

    def rstrip(self):
        return String(rstrip(self.value))

    def lower(self):
        return String(lower(self.value))

    def upper(self):
        return String(upper(self.value))

    def replace(self, sub_old, sub_new):
        return String(replace(self.value, sub_old, sub_new))

    def sprintf(self, *argv):
        return String(sprintf(self.value, *argv))

    def utf8(self):
        return to_utf8(self.value)

    def split(self, c=None):
        return split(self.value, c)

    def contains(self, sub):
        return contains(self.value, sub)