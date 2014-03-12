(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
Type.__name__ = true;
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
var byte = {};
byte._LittleEndianReader = {};
byte._LittleEndianReader.LittleEndianReader_Impl_ = function() { };
byte._LittleEndianReader.LittleEndianReader_Impl_.__name__ = true;
byte._LittleEndianReader.LittleEndianReader_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt8 = function(this1,pos) {
	var n = this1[pos];
	if(n >= 128) return n - 256;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt8 = function(this1,pos) {
	return this1[pos];
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var n = ch1 | ch2 << 8;
	if((n & 32768) != 0) return n - 65536;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	return ch1 | ch2 << 8;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var n = ch1 | ch2 << 8 | ch3 << 16;
	if((n & 8388608) != 0) return n - 16777216;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	return ch1 | ch2 << 8 | ch3 << 16;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt32 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var ch4 = this1[pos + 3];
	return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readString = function(this1,pos,len) {
	return byte.js._ByteData.ByteData_Impl_.readString(this1,pos,len);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readFloat = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
	var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
	if(sig == 0 && exp == -127) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readDouble = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	bytes.push(this1[pos + 4]);
	bytes.push(this1[pos + 5]);
	bytes.push(this1[pos + 6]);
	bytes.push(this1[pos + 7]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
	var sig = byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig(this1,bytes);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig = function(this1,bytes) {
	return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
};
byte._LittleEndianWriter = {};
byte._LittleEndianWriter.LittleEndianWriter_Impl_ = function() { };
byte._LittleEndianWriter.LittleEndianWriter_Impl_.__name__ = true;
byte._LittleEndianWriter.LittleEndianWriter_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt8 = function(this1,pos,x) {
	if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt8 = function(this1,pos,x) {
	this1[pos] = x & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt16 = function(this1,pos,x) {
	if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16(this1,pos,x & 65535);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16 = function(this1,pos,x) {
	if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt24 = function(this1,pos,x) {
	if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24(this1,pos,x & 16777215);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24 = function(this1,pos,x) {
	if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt32 = function(this1,pos,x) {
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255 & 255;
	this1[pos + 3] = x >>> 24 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeFloat = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
	var b1;
	b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 127 << 7 & 255 | sig >> 16 & 127;
	var b3 = sig >> 8 & 255;
	var b4 = sig & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeDouble = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		this1[pos + 4] = 0;
		this1[pos + 5] = 0;
		this1[pos + 6] = 0;
		this1[pos + 7] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
	var sig_h = sig & 34359738367;
	var sig_l = Math.floor(sig / Math.pow(2,32));
	var b1;
	b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15;
	var b3 = sig_l >> 8 & 255;
	var b4 = sig_l & 255;
	var b5 = sig_h >> 24 & 255;
	var b6 = sig_h >> 16 & 255;
	var b7 = sig_h >> 8 & 255;
	var b8 = sig_h & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
	this1[pos + 4] = b5 & 255;
	this1[pos + 5] = b6 & 255;
	this1[pos + 6] = b7 & 255;
	this1[pos + 7] = b8 & 255;
};
byte.js = {};
byte.js._ByteData = {};
byte.js._ByteData.ByteData_Impl_ = function() { };
byte.js._ByteData.ByteData_Impl_.__name__ = true;
byte.js._ByteData.ByteData_Impl_.get_length = function(this1) {
	return this1.length;
};
byte.js._ByteData.ByteData_Impl_.get_reader = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_.get_writer = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_._new = function(data) {
	return data;
};
byte.js._ByteData.ByteData_Impl_.readByte = function(this1,pos) {
	return this1[pos];
};
byte.js._ByteData.ByteData_Impl_.writeByte = function(this1,pos,v) {
	this1[pos] = v & 255;
};
byte.js._ByteData.ByteData_Impl_.readString = function(this1,pos,len) {
	var buf = new StringBuf();
	var _g1 = pos;
	var _g = pos + len;
	while(_g1 < _g) {
		var i = _g1++;
		buf.b += String.fromCharCode(this1[i]);
	}
	return buf.b;
};
byte.js._ByteData.ByteData_Impl_.alloc = function(length) {
	var b = new Int8Array(length);
	return b;
};
byte.js._ByteData.ByteData_Impl_.ofString = function(s) {
	var a = new Int8Array(s.length);
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = s.charCodeAt(i);
	}
	return a;
};
var haxe = {};
haxe.Resource = function() { };
haxe.Resource.__name__ = true;
haxe.Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.crypto.Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
haxe.crypto.Base64.__name__ = true;
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
haxe.crypto.BaseCode.__name__ = true;
haxe.crypto.BaseCode.prototype = {
	initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
haxe.ds = {};
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.ds.GenericCell.__name__ = true;
haxe.ds.GenericCell.prototype = {
	__class__: haxe.ds.GenericCell
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.macro = {};
haxe.macro.Constant = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Binop = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ComplexType = { __ename__ : true, __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
haxe.macro.Printer.__name__ = true;
haxe.macro.Printer.prototype = {
	printUnop: function(op) {
		switch(op[1]) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		}
	}
	,printBinop: function(op) {
		switch(op[1]) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 20:
			var op1 = op[2];
			return this.printBinop(op1) + "=";
		}
	}
	,__class__: haxe.macro.Printer
};
var haxeparser = {};
haxeparser.Keyword = { __ename__ : true, __constructs__ : ["KwdFunction","KwdClass","KwdVar","KwdIf","KwdElse","KwdWhile","KwdDo","KwdFor","KwdBreak","KwdContinue","KwdReturn","KwdExtends","KwdImplements","KwdImport","KwdSwitch","KwdCase","KwdDefault","KwdStatic","KwdPublic","KwdPrivate","KwdTry","KwdCatch","KwdNew","KwdThis","KwdThrow","KwdExtern","KwdEnum","KwdIn","KwdInterface","KwdUntyped","KwdCast","KwdOverride","KwdTypedef","KwdDynamic","KwdPackage","KwdInline","KwdUsing","KwdNull","KwdTrue","KwdFalse","KwdAbstract","KwdMacro"] };
haxeparser.Keyword.KwdFunction = ["KwdFunction",0];
haxeparser.Keyword.KwdFunction.toString = $estr;
haxeparser.Keyword.KwdFunction.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdClass = ["KwdClass",1];
haxeparser.Keyword.KwdClass.toString = $estr;
haxeparser.Keyword.KwdClass.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdVar = ["KwdVar",2];
haxeparser.Keyword.KwdVar.toString = $estr;
haxeparser.Keyword.KwdVar.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdIf = ["KwdIf",3];
haxeparser.Keyword.KwdIf.toString = $estr;
haxeparser.Keyword.KwdIf.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdElse = ["KwdElse",4];
haxeparser.Keyword.KwdElse.toString = $estr;
haxeparser.Keyword.KwdElse.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdWhile = ["KwdWhile",5];
haxeparser.Keyword.KwdWhile.toString = $estr;
haxeparser.Keyword.KwdWhile.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDo = ["KwdDo",6];
haxeparser.Keyword.KwdDo.toString = $estr;
haxeparser.Keyword.KwdDo.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdFor = ["KwdFor",7];
haxeparser.Keyword.KwdFor.toString = $estr;
haxeparser.Keyword.KwdFor.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdBreak = ["KwdBreak",8];
haxeparser.Keyword.KwdBreak.toString = $estr;
haxeparser.Keyword.KwdBreak.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdContinue = ["KwdContinue",9];
haxeparser.Keyword.KwdContinue.toString = $estr;
haxeparser.Keyword.KwdContinue.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdReturn = ["KwdReturn",10];
haxeparser.Keyword.KwdReturn.toString = $estr;
haxeparser.Keyword.KwdReturn.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdExtends = ["KwdExtends",11];
haxeparser.Keyword.KwdExtends.toString = $estr;
haxeparser.Keyword.KwdExtends.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdImplements = ["KwdImplements",12];
haxeparser.Keyword.KwdImplements.toString = $estr;
haxeparser.Keyword.KwdImplements.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdImport = ["KwdImport",13];
haxeparser.Keyword.KwdImport.toString = $estr;
haxeparser.Keyword.KwdImport.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdSwitch = ["KwdSwitch",14];
haxeparser.Keyword.KwdSwitch.toString = $estr;
haxeparser.Keyword.KwdSwitch.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCase = ["KwdCase",15];
haxeparser.Keyword.KwdCase.toString = $estr;
haxeparser.Keyword.KwdCase.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDefault = ["KwdDefault",16];
haxeparser.Keyword.KwdDefault.toString = $estr;
haxeparser.Keyword.KwdDefault.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdStatic = ["KwdStatic",17];
haxeparser.Keyword.KwdStatic.toString = $estr;
haxeparser.Keyword.KwdStatic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPublic = ["KwdPublic",18];
haxeparser.Keyword.KwdPublic.toString = $estr;
haxeparser.Keyword.KwdPublic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPrivate = ["KwdPrivate",19];
haxeparser.Keyword.KwdPrivate.toString = $estr;
haxeparser.Keyword.KwdPrivate.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTry = ["KwdTry",20];
haxeparser.Keyword.KwdTry.toString = $estr;
haxeparser.Keyword.KwdTry.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCatch = ["KwdCatch",21];
haxeparser.Keyword.KwdCatch.toString = $estr;
haxeparser.Keyword.KwdCatch.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdNew = ["KwdNew",22];
haxeparser.Keyword.KwdNew.toString = $estr;
haxeparser.Keyword.KwdNew.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdThis = ["KwdThis",23];
haxeparser.Keyword.KwdThis.toString = $estr;
haxeparser.Keyword.KwdThis.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdThrow = ["KwdThrow",24];
haxeparser.Keyword.KwdThrow.toString = $estr;
haxeparser.Keyword.KwdThrow.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdExtern = ["KwdExtern",25];
haxeparser.Keyword.KwdExtern.toString = $estr;
haxeparser.Keyword.KwdExtern.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdEnum = ["KwdEnum",26];
haxeparser.Keyword.KwdEnum.toString = $estr;
haxeparser.Keyword.KwdEnum.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdIn = ["KwdIn",27];
haxeparser.Keyword.KwdIn.toString = $estr;
haxeparser.Keyword.KwdIn.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdInterface = ["KwdInterface",28];
haxeparser.Keyword.KwdInterface.toString = $estr;
haxeparser.Keyword.KwdInterface.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdUntyped = ["KwdUntyped",29];
haxeparser.Keyword.KwdUntyped.toString = $estr;
haxeparser.Keyword.KwdUntyped.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCast = ["KwdCast",30];
haxeparser.Keyword.KwdCast.toString = $estr;
haxeparser.Keyword.KwdCast.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdOverride = ["KwdOverride",31];
haxeparser.Keyword.KwdOverride.toString = $estr;
haxeparser.Keyword.KwdOverride.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTypedef = ["KwdTypedef",32];
haxeparser.Keyword.KwdTypedef.toString = $estr;
haxeparser.Keyword.KwdTypedef.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDynamic = ["KwdDynamic",33];
haxeparser.Keyword.KwdDynamic.toString = $estr;
haxeparser.Keyword.KwdDynamic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPackage = ["KwdPackage",34];
haxeparser.Keyword.KwdPackage.toString = $estr;
haxeparser.Keyword.KwdPackage.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdInline = ["KwdInline",35];
haxeparser.Keyword.KwdInline.toString = $estr;
haxeparser.Keyword.KwdInline.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdUsing = ["KwdUsing",36];
haxeparser.Keyword.KwdUsing.toString = $estr;
haxeparser.Keyword.KwdUsing.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdNull = ["KwdNull",37];
haxeparser.Keyword.KwdNull.toString = $estr;
haxeparser.Keyword.KwdNull.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTrue = ["KwdTrue",38];
haxeparser.Keyword.KwdTrue.toString = $estr;
haxeparser.Keyword.KwdTrue.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdFalse = ["KwdFalse",39];
haxeparser.Keyword.KwdFalse.toString = $estr;
haxeparser.Keyword.KwdFalse.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdAbstract = ["KwdAbstract",40];
haxeparser.Keyword.KwdAbstract.toString = $estr;
haxeparser.Keyword.KwdAbstract.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdMacro = ["KwdMacro",41];
haxeparser.Keyword.KwdMacro.toString = $estr;
haxeparser.Keyword.KwdMacro.__enum__ = haxeparser.Keyword;
haxeparser.TokenDef = { __ename__ : true, __constructs__ : ["Kwd","Const","Sharp","Dollar","Unop","Binop","Comment","CommentLine","IntInterval","Semicolon","Dot","DblDot","Arrow","Comma","BkOpen","BkClose","BrOpen","BrClose","POpen","PClose","Question","At","Eof"] };
haxeparser.TokenDef.Kwd = function(k) { var $x = ["Kwd",0,k]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Const = function(c) { var $x = ["Const",1,c]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Sharp = function(s) { var $x = ["Sharp",2,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Dollar = function(s) { var $x = ["Dollar",3,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Unop = function(op) { var $x = ["Unop",4,op]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Binop = function(op) { var $x = ["Binop",5,op]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Comment = function(s) { var $x = ["Comment",6,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.CommentLine = function(s) { var $x = ["CommentLine",7,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.IntInterval = function(s) { var $x = ["IntInterval",8,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Semicolon = ["Semicolon",9];
haxeparser.TokenDef.Semicolon.toString = $estr;
haxeparser.TokenDef.Semicolon.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Dot = ["Dot",10];
haxeparser.TokenDef.Dot.toString = $estr;
haxeparser.TokenDef.Dot.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.DblDot = ["DblDot",11];
haxeparser.TokenDef.DblDot.toString = $estr;
haxeparser.TokenDef.DblDot.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Arrow = ["Arrow",12];
haxeparser.TokenDef.Arrow.toString = $estr;
haxeparser.TokenDef.Arrow.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Comma = ["Comma",13];
haxeparser.TokenDef.Comma.toString = $estr;
haxeparser.TokenDef.Comma.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BkOpen = ["BkOpen",14];
haxeparser.TokenDef.BkOpen.toString = $estr;
haxeparser.TokenDef.BkOpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BkClose = ["BkClose",15];
haxeparser.TokenDef.BkClose.toString = $estr;
haxeparser.TokenDef.BkClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BrOpen = ["BrOpen",16];
haxeparser.TokenDef.BrOpen.toString = $estr;
haxeparser.TokenDef.BrOpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BrClose = ["BrClose",17];
haxeparser.TokenDef.BrClose.toString = $estr;
haxeparser.TokenDef.BrClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.POpen = ["POpen",18];
haxeparser.TokenDef.POpen.toString = $estr;
haxeparser.TokenDef.POpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.PClose = ["PClose",19];
haxeparser.TokenDef.PClose.toString = $estr;
haxeparser.TokenDef.PClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Question = ["Question",20];
haxeparser.TokenDef.Question.toString = $estr;
haxeparser.TokenDef.Question.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.At = ["At",21];
haxeparser.TokenDef.At.toString = $estr;
haxeparser.TokenDef.At.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Eof = ["Eof",22];
haxeparser.TokenDef.Eof.toString = $estr;
haxeparser.TokenDef.Eof.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDefPrinter = function() { };
haxeparser.TokenDefPrinter.__name__ = true;
haxeparser.TokenDefPrinter.print = function(def) {
	switch(def[1]) {
	case 0:
		var k = def[2];
		return HxOverrides.substr(k[0],3,null).toLowerCase();
	case 1:
		switch(def[2][1]) {
		case 0:
			var s = def[2][2];
			return s;
		case 1:
			var s = def[2][2];
			return s;
		case 3:
			var s = def[2][2];
			return s;
		case 2:
			var s1 = def[2][2];
			return "\"" + s1 + "\"";
		case 4:
			var opt = def[2][3];
			var r = def[2][2];
			return "~/" + r + "/" + opt;
		}
		break;
	case 2:
		var s2 = def[2];
		return "#" + s2;
	case 3:
		var s3 = def[2];
		return "$" + s3;
	case 4:
		var op = def[2];
		return new haxe.macro.Printer("").printUnop(op);
	case 5:
		var op1 = def[2];
		return new haxe.macro.Printer("").printBinop(op1);
	case 6:
		var s4 = def[2];
		return "/*" + s4 + "/*";
	case 7:
		var s5 = def[2];
		return "//" + s5;
	case 8:
		var s6 = def[2];
		return "" + s6 + "...";
	case 9:
		return ";";
	case 10:
		return ".";
	case 11:
		return ":";
	case 12:
		return "->";
	case 13:
		return ",";
	case 14:
		return "[";
	case 15:
		return "]";
	case 16:
		return "{";
	case 17:
		return "}";
	case 18:
		return "(";
	case 19:
		return ")";
	case 20:
		return "?";
	case 21:
		return "@";
	case 22:
		return "<eof>";
	}
};
haxeparser.Token = function(tok,pos) {
	this.tok = tok;
	this.pos = pos;
};
haxeparser.Token.__name__ = true;
haxeparser.Token.prototype = {
	toString: function() {
		return haxeparser.TokenDefPrinter.print(this.tok);
	}
	,__class__: haxeparser.Token
};
haxeparser.TypeDef = { __ename__ : true, __constructs__ : ["EClass","EEnum","EAbstract","EImport","ETypedef","EUsing"] };
haxeparser.TypeDef.EClass = function(d) { var $x = ["EClass",0,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EEnum = function(d) { var $x = ["EEnum",1,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EAbstract = function(a) { var $x = ["EAbstract",2,a]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EImport = function(sl,mode) { var $x = ["EImport",3,sl,mode]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.ETypedef = function(d) { var $x = ["ETypedef",4,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EUsing = function(path) { var $x = ["EUsing",5,path]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.ClassFlag = { __ename__ : true, __constructs__ : ["HInterface","HExtern","HPrivate","HExtends","HImplements"] };
haxeparser.ClassFlag.HInterface = ["HInterface",0];
haxeparser.ClassFlag.HInterface.toString = $estr;
haxeparser.ClassFlag.HInterface.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HExtern = ["HExtern",1];
haxeparser.ClassFlag.HExtern.toString = $estr;
haxeparser.ClassFlag.HExtern.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HPrivate = ["HPrivate",2];
haxeparser.ClassFlag.HPrivate.toString = $estr;
haxeparser.ClassFlag.HPrivate.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HExtends = function(t) { var $x = ["HExtends",3,t]; $x.__enum__ = haxeparser.ClassFlag; $x.toString = $estr; return $x; };
haxeparser.ClassFlag.HImplements = function(t) { var $x = ["HImplements",4,t]; $x.__enum__ = haxeparser.ClassFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag = { __ename__ : true, __constructs__ : ["APrivAbstract","AFromType","AToType","AIsType"] };
haxeparser.AbstractFlag.APrivAbstract = ["APrivAbstract",0];
haxeparser.AbstractFlag.APrivAbstract.toString = $estr;
haxeparser.AbstractFlag.APrivAbstract.__enum__ = haxeparser.AbstractFlag;
haxeparser.AbstractFlag.AFromType = function(ct) { var $x = ["AFromType",1,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag.AToType = function(ct) { var $x = ["AToType",2,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag.AIsType = function(ct) { var $x = ["AIsType",3,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.EnumFlag = { __ename__ : true, __constructs__ : ["EPrivate","EExtern"] };
haxeparser.EnumFlag.EPrivate = ["EPrivate",0];
haxeparser.EnumFlag.EPrivate.toString = $estr;
haxeparser.EnumFlag.EPrivate.__enum__ = haxeparser.EnumFlag;
haxeparser.EnumFlag.EExtern = ["EExtern",1];
haxeparser.EnumFlag.EExtern.toString = $estr;
haxeparser.EnumFlag.EExtern.__enum__ = haxeparser.EnumFlag;
haxeparser.ImportMode = { __ename__ : true, __constructs__ : ["INormal","IAsName","IAll"] };
haxeparser.ImportMode.INormal = ["INormal",0];
haxeparser.ImportMode.INormal.toString = $estr;
haxeparser.ImportMode.INormal.__enum__ = haxeparser.ImportMode;
haxeparser.ImportMode.IAsName = function(s) { var $x = ["IAsName",1,s]; $x.__enum__ = haxeparser.ImportMode; $x.toString = $estr; return $x; };
haxeparser.ImportMode.IAll = ["IAll",2];
haxeparser.ImportMode.IAll.toString = $estr;
haxeparser.ImportMode.IAll.__enum__ = haxeparser.ImportMode;
haxeparser.LexerErrorMsg = { __ename__ : true, __constructs__ : ["UnterminatedString","UnterminatedRegExp","UnclosedComment"] };
haxeparser.LexerErrorMsg.UnterminatedString = ["UnterminatedString",0];
haxeparser.LexerErrorMsg.UnterminatedString.toString = $estr;
haxeparser.LexerErrorMsg.UnterminatedString.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerErrorMsg.UnterminatedRegExp = ["UnterminatedRegExp",1];
haxeparser.LexerErrorMsg.UnterminatedRegExp.toString = $estr;
haxeparser.LexerErrorMsg.UnterminatedRegExp.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerErrorMsg.UnclosedComment = ["UnclosedComment",2];
haxeparser.LexerErrorMsg.UnclosedComment.toString = $estr;
haxeparser.LexerErrorMsg.UnclosedComment.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerError = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
haxeparser.LexerError.__name__ = true;
haxeparser.LexerError.prototype = {
	__class__: haxeparser.LexerError
};
var hxparse = {};
hxparse.Lexer = function(input,sourceName) {
	if(sourceName == null) sourceName = "<null>";
	this.current = "";
	this.input = input;
	this.source = sourceName;
	this.pos = 0;
	this.eof = false;
};
hxparse.Lexer.__name__ = true;
hxparse.Lexer.buildRuleset = function(rules) {
	var cases = [];
	var functions = [];
	var eofFunction = null;
	var _g = 0;
	while(_g < rules.length) {
		var rule = rules[_g];
		++_g;
		if(rule.rule == "") eofFunction = rule.func; else {
			cases.push(hxparse.LexEngine.parse(rule.rule));
			functions.push(rule.func);
		}
	}
	return new hxparse.Ruleset(new hxparse.LexEngine(cases).firstState(),functions,eofFunction);
};
hxparse.Lexer.prototype = {
	curPos: function() {
		return new hxparse.Position(this.source,this.pos - this.current.length,this.pos);
	}
	,token: function(ruleset) {
		if(this.eof) {
			if(ruleset.eofFunction != null) return ruleset.eofFunction(this); else throw new haxe.io.Eof();
		}
		var state = ruleset.state;
		var lastMatch = null;
		var lastMatchPos = this.pos;
		var start = this.pos;
		while(true) {
			if(state["final"] > -1) {
				lastMatch = state;
				lastMatchPos = this.pos;
			}
			if(this.pos == byte.js._ByteData.ByteData_Impl_.get_length(this.input)) {
				this.eof = true;
				break;
			}
			var i = this.input[this.pos];
			this.pos++;
			state = state.trans[i];
			if(state == null) break;
		}
		this.pos = lastMatchPos;
		this.current = byte.js._ByteData.ByteData_Impl_.readString(this.input,start,this.pos - start);
		if(lastMatch == null || lastMatch["final"] == -1) throw new hxparse.UnexpectedChar(String.fromCharCode(this.input[this.pos]),new hxparse.Position(this.source,this.pos - this.current.length,this.pos));
		return ruleset.functions[lastMatch["final"]](this);
	}
	,__class__: hxparse.Lexer
};
hxparse.RuleBuilder = function() { };
hxparse.RuleBuilder.__name__ = true;
hxparse.LexEngine = function(patterns) {
	this.nodes = [];
	this.finals = [];
	this.states = [];
	this.hstates = new haxe.ds.StringMap();
	this.uid = 0;
	var pid = 0;
	var _g = 0;
	while(_g < patterns.length) {
		var p = patterns[_g];
		++_g;
		var id = pid++;
		var f = new hxparse._LexEngine.Node(this.uid++,id);
		var n = this.initNode(p,f,id);
		this.nodes.push(n);
		this.finals.push(f);
	}
	this.makeState(this.addNodes([],this.nodes));
};
hxparse.LexEngine.__name__ = true;
hxparse.LexEngine.single = function(c) {
	return [{ min : c, max : c}];
};
hxparse.LexEngine.parse = function(pattern) {
	var p = hxparse.LexEngine.parseInner(pattern);
	if(p == null) throw "Invalid pattern '" + pattern + "'";
	return p.pattern;
};
hxparse.LexEngine.next = function(a,b) {
	if(a == hxparse._LexEngine.Pattern.Empty) return b; else return hxparse._LexEngine.Pattern.Next(a,b);
};
hxparse.LexEngine.plus = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.plus(r2));
	default:
		return hxparse._LexEngine.Pattern.Plus(r);
	}
};
hxparse.LexEngine.star = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.star(r2));
	default:
		return hxparse._LexEngine.Pattern.Star(r);
	}
};
hxparse.LexEngine.opt = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.opt(r2));
	default:
		return hxparse._LexEngine.Pattern.Choice(r,hxparse._LexEngine.Pattern.Empty);
	}
};
hxparse.LexEngine.cinter = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),hxparse.LexEngine.ccomplement(c2)));
};
hxparse.LexEngine.cdiff = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),c2));
};
hxparse.LexEngine.ccomplement = function(c) {
	var first = c[0];
	var start;
	if(first != null && first.min == -1) start = c.shift().max + 1; else start = -1;
	var out = [];
	var _g = 0;
	while(_g < c.length) {
		var k = c[_g];
		++_g;
		out.push({ min : start, max : k.min - 1});
		start = k.max + 1;
	}
	if(start <= 255) out.push({ min : start, max : 255});
	return out;
};
hxparse.LexEngine.cunion = function(ca,cb) {
	var i = 0;
	var j = 0;
	var out = [];
	var a = ca[i++];
	var b = cb[j++];
	while(true) {
		if(a == null) {
			out.push(b);
			while(j < cb.length) out.push(cb[j++]);
			break;
		}
		if(b == null) {
			out.push(a);
			while(i < ca.length) out.push(ca[i++]);
			break;
		}
		if(a.min <= b.min) {
			if(a.max + 1 < b.min) {
				out.push(a);
				a = ca[i++];
			} else if(a.max < b.max) {
				b = { min : a.min, max : b.max};
				a = ca[i++];
			} else b = cb[j++];
		} else {
			var tmp = ca;
			ca = cb;
			cb = tmp;
			var tmp1 = j;
			j = i;
			i = tmp1;
			var tmp2 = a;
			a = b;
			b = tmp2;
		}
	}
	return out;
};
hxparse.LexEngine.parseInner = function(pattern,i,pDepth) {
	if(pDepth == null) pDepth = 0;
	if(i == null) i = 0;
	var r = hxparse._LexEngine.Pattern.Empty;
	var l = pattern.length;
	while(i < l) {
		var c = StringTools.fastCodeAt(pattern,i++);
		switch(c) {
		case 43:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.plus(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 42:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.star(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 63:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.opt(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 124:
			if(r != hxparse._LexEngine.Pattern.Empty) {
				var r2 = hxparse.LexEngine.parseInner(pattern,i);
				return { pattern : hxparse._LexEngine.Pattern.Choice(r,r2.pattern), pos : r2.pos};
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 40:
			var r21 = hxparse.LexEngine.parseInner(pattern,i,pDepth + 1);
			i = r21.pos;
			r = hxparse.LexEngine.next(r,r21.pattern);
			break;
		case 41:
			return { pattern : hxparse._LexEngine.Pattern.Group(r), pos : i};
		case 91:
			if(pattern.length > 1) {
				var range = 0;
				var acc = [];
				var not = pattern.charCodeAt(i) == 94;
				if(not) i++;
				while(true) {
					var c1 = StringTools.fastCodeAt(pattern,i++);
					if(c1 == 93) {
						if(range != 0) return null;
						break;
					} else if(c1 == 45) {
						if(range != 0) return null;
						var last = acc.pop();
						if(last == null) acc.push({ min : c1, max : c1}); else {
							if(last.min != last.max) return null;
							range = last.min;
						}
					} else {
						if(c1 == 92) c1 = StringTools.fastCodeAt(pattern,i++);
						if(range == 0) acc.push({ min : c1, max : c1}); else {
							acc.push({ min : range, max : c1});
							range = 0;
						}
					}
				}
				var g = [];
				var _g = 0;
				while(_g < acc.length) {
					var k = acc[_g];
					++_g;
					g = hxparse.LexEngine.cunion(g,[k]);
				}
				if(not) g = hxparse.LexEngine.cdiff(hxparse.LexEngine.ALL_CHARS,g);
				r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match(g));
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 92:
			c = StringTools.fastCodeAt(pattern,i++);
			if(c != c) c = 92; else if(c >= 48 && c <= 57) {
				var v = c - 48;
				while(true) {
					var cNext = pattern.charCodeAt(i);
					if(cNext >= 48 && cNext <= 57) {
						v = v * 10 + (cNext - 48);
						++i;
					} else break;
				}
				c = v;
			}
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		default:
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
		}
	}
	if(pDepth != 0) throw "Found unclosed parenthesis while parsing \"" + pattern + "\"";
	return { pattern : r, pos : i};
};
hxparse.LexEngine.prototype = {
	firstState: function() {
		return this.states[0];
	}
	,makeState: function(nodes) {
		var _g = this;
		var buf = new StringBuf();
		var _g1 = 0;
		while(_g1 < nodes.length) {
			var n = nodes[_g1];
			++_g1;
			buf.b += Std.string(n.id);
			buf.b += "-";
		}
		var key = buf.b;
		var s = this.hstates.get(key);
		if(s != null) return s;
		s = new hxparse.State();
		this.states.push(s);
		this.hstates.set(key,s);
		var trans = this.getTransitions(nodes);
		var _g2 = 0;
		while(_g2 < trans.length) {
			var t = trans[_g2];
			++_g2;
			var target = this.makeState(t.n);
			var _g11 = 0;
			var _g21 = t.chars;
			while(_g11 < _g21.length) {
				var chr = _g21[_g11];
				++_g11;
				var _g4 = chr.min;
				var _g3 = chr.max + 1;
				while(_g4 < _g3) {
					var i = _g4++;
					s.trans[i] = target;
				}
			}
		}
		var setFinal = function() {
			var _g12 = 0;
			var _g22 = _g.finals;
			while(_g12 < _g22.length) {
				var f = _g22[_g12];
				++_g12;
				var _g31 = 0;
				while(_g31 < nodes.length) {
					var n1 = nodes[_g31];
					++_g31;
					if(n1 == f) {
						s["final"] = n1.pid;
						return;
					}
				}
			}
		};
		if(s["final"] == -1) setFinal();
		return s;
	}
	,getTransitions: function(nodes) {
		var tl = [];
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			var _g1 = 0;
			var _g2 = n.trans;
			while(_g1 < _g2.length) {
				var t = _g2[_g1];
				++_g1;
				tl.push(t);
			}
		}
		tl.sort(function(t1,t2) {
			return t1.n.id - t2.n.id;
		});
		var t0 = tl[0];
		var _g11 = 1;
		var _g3 = tl.length;
		while(_g11 < _g3) {
			var i = _g11++;
			var t11 = tl[i];
			if(t0.n == t11.n) {
				tl[i - 1] = null;
				t11 = { chars : hxparse.LexEngine.cunion(t0.chars,t11.chars), n : t11.n};
				tl[i] = t11;
			}
			t0 = t11;
		}
		while(HxOverrides.remove(tl,null)) {
		}
		var allChars = hxparse.LexEngine.EMPTY;
		var allStates = new List();
		var _g4 = 0;
		while(_g4 < tl.length) {
			var t3 = tl[_g4];
			++_g4;
			var states = new List();
			states.push({ chars : hxparse.LexEngine.cdiff(t3.chars,allChars), n : [t3.n]});
			var $it0 = allStates.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				var nodes1 = s.n.slice();
				nodes1.push(t3.n);
				states.push({ chars : hxparse.LexEngine.cinter(s.chars,t3.chars), n : nodes1});
				states.push({ chars : hxparse.LexEngine.cdiff(s.chars,t3.chars), n : s.n});
			}
			var $it1 = states.iterator();
			while( $it1.hasNext() ) {
				var s1 = $it1.next();
				if(s1.chars.length == 0) states.remove(s1);
			}
			allChars = hxparse.LexEngine.cunion(allChars,t3.chars);
			allStates = states;
		}
		var states1 = [];
		var $it2 = allStates.iterator();
		while( $it2.hasNext() ) {
			var s2 = $it2.next();
			states1.push({ chars : s2.chars, n : this.addNodes([],s2.n)});
		}
		states1.sort(function(s11,s21) {
			var a = s11.chars.length;
			var b = s21.chars.length;
			var _g12 = 0;
			var _g5;
			if(a < b) _g5 = a; else _g5 = b;
			while(_g12 < _g5) {
				var i1 = _g12++;
				var a1 = s11.chars[i1];
				var b1 = s21.chars[i1];
				if(a1.min != b1.min) return b1.min - a1.min;
				if(a1.max != b1.max) return b1.max - a1.max;
			}
			if(a < b) return b - a;
			return 0;
		});
		return states1;
	}
	,addNode: function(nodes,n) {
		var _g = 0;
		while(_g < nodes.length) {
			var n2 = nodes[_g];
			++_g;
			if(n == n2) return;
		}
		nodes.push(n);
		this.addNodes(nodes,n.epsilon);
	}
	,addNodes: function(nodes,add) {
		var _g = 0;
		while(_g < add.length) {
			var n = add[_g];
			++_g;
			this.addNode(nodes,n);
		}
		return nodes;
	}
	,node: function(pid) {
		return new hxparse._LexEngine.Node(this.uid++,pid);
	}
	,initNode: function(p,$final,pid) {
		switch(p[1]) {
		case 0:
			return $final;
		case 1:
			var c = p[2];
			var n = new hxparse._LexEngine.Node(this.uid++,pid);
			n.trans.push({ chars : c, n : $final});
			return n;
		case 2:
			var p1 = p[2];
			var n1 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an = this.initNode(p1,n1,pid);
			n1.epsilon.push(an);
			n1.epsilon.push($final);
			return n1;
		case 3:
			var p2 = p[2];
			var n2 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an1 = this.initNode(p2,n2,pid);
			n2.epsilon.push(an1);
			n2.epsilon.push($final);
			return an1;
		case 4:
			var b = p[3];
			var a = p[2];
			return this.initNode(a,this.initNode(b,$final,pid),pid);
		case 5:
			var b1 = p[3];
			var a1 = p[2];
			var n3 = new hxparse._LexEngine.Node(this.uid++,pid);
			n3.epsilon.push(this.initNode(a1,$final,pid));
			n3.epsilon.push(this.initNode(b1,$final,pid));
			return n3;
		case 6:
			var p3 = p[2];
			return this.initNode(p3,$final,pid);
		}
	}
	,__class__: hxparse.LexEngine
};
hxparse._LexEngine = {};
hxparse._LexEngine.Pattern = { __ename__ : true, __constructs__ : ["Empty","Match","Star","Plus","Next","Choice","Group"] };
hxparse._LexEngine.Pattern.Empty = ["Empty",0];
hxparse._LexEngine.Pattern.Empty.toString = $estr;
hxparse._LexEngine.Pattern.Empty.__enum__ = hxparse._LexEngine.Pattern;
hxparse._LexEngine.Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Group = function(p) { var $x = ["Group",6,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
hxparse._LexEngine.Node.__name__ = true;
hxparse._LexEngine.Node.prototype = {
	__class__: hxparse._LexEngine.Node
};
hxparse.Ruleset = function(state,functions,eofFunction) {
	this.state = state;
	this.functions = functions;
	this.eofFunction = eofFunction;
};
hxparse.Ruleset.__name__ = true;
hxparse.Ruleset.prototype = {
	__class__: hxparse.Ruleset
};
hxparse.Position = function(source,min,max) {
	this.psource = source;
	this.pmin = min;
	this.pmax = max;
};
hxparse.Position.__name__ = true;
hxparse.Position.union = function(p1,p2) {
	return new hxparse.Position(p1.psource,p1.pmin < p2.pmin?p1.pmin:p2.pmin,p1.pmax > p2.pmax?p1.pmax:p2.pmax);
};
hxparse.Position.prototype = {
	toString: function() {
		return "" + this.psource + ":characters " + this.pmin + "-" + this.pmax;
	}
	,getLinePosition: function(input) {
		var lineMin = 1;
		var lineMax = 1;
		var posMin = 0;
		var posMax = 0;
		var cur = 0;
		while(cur < this.pmin) {
			if(input[cur] == 10) {
				lineMin++;
				posMin = cur;
			}
			cur++;
		}
		lineMax = lineMin;
		posMax = posMin;
		posMin = cur - posMin;
		while(cur < this.pmax) {
			if(input[cur] == 10) {
				lineMax++;
				posMax = cur;
			}
			cur++;
		}
		posMax = cur - posMax;
		return { lineMin : lineMin, lineMax : lineMax, posMin : posMin, posMax : posMax};
	}
	,format: function(input) {
		var linePos = this.getLinePosition(input);
		if(linePos.lineMin != linePos.lineMax) return "" + this.psource + ":lines " + linePos.lineMin + "-" + linePos.lineMax; else return "" + this.psource + ":line " + linePos.lineMin + ":characters " + linePos.posMin + "-" + linePos.posMax;
	}
	,__class__: hxparse.Position
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
haxeparser.HaxeLexer = function(input,sourceName) {
	hxparse.Lexer.call(this,input,sourceName);
};
haxeparser.HaxeLexer.__name__ = true;
haxeparser.HaxeLexer.__interfaces__ = [hxparse.RuleBuilder];
haxeparser.HaxeLexer.mkPos = function(p) {
	return { file : p.psource, min : p.pmin, max : p.pmax};
};
haxeparser.HaxeLexer.mk = function(lexer,td) {
	return new haxeparser.Token(td,haxeparser.HaxeLexer.mkPos(new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos)));
};
haxeparser.HaxeLexer.__super__ = hxparse.Lexer;
haxeparser.HaxeLexer.prototype = $extend(hxparse.Lexer.prototype,{
	__class__: haxeparser.HaxeLexer
});
var haxeprinter = {};
haxeprinter.Demo = function() { };
haxeprinter.Demo.__name__ = true;
haxeprinter.Demo.main = function() {
	var input = window.document.getElementById("input");
	var output = window.document.getElementById("output");
	var config = window.document.getElementById("config");
	haxeprinter.Demo.cfg = JSON.parse(haxe.Resource.getString("config-default"));
	var cfg2 = JSON.parse(haxe.Resource.getString("config"));
	var _g = 0;
	var _g1 = Reflect.fields(cfg2);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		if(!Object.prototype.hasOwnProperty.call(haxeprinter.Demo.cfg,field)) throw "Invalid config field: " + field;
		Reflect.setField(haxeprinter.Demo.cfg,field,Reflect.field(cfg2,field));
	}
	var html = "<form>";
	var _g2 = 0;
	var _g11 = Reflect.fields(haxeprinter.Demo.cfg);
	while(_g2 < _g11.length) {
		var field1 = _g11[_g2];
		++_g2;
		var label = field1.split("_").join(" ");
		var value = Reflect.field(haxeprinter.Demo.cfg,field1);
		if(value == true || value == false) {
			var checked;
			if(value) checked = " checked"; else checked = "";
			html += "<fieldset><input type=\"checkbox\" name=\"" + field1 + "\"" + checked + "/></input<label for=\"" + field1 + "\">" + label + "</label></fieldset>";
		}
	}
	config.innerHTML = html + "</form>";
	config.onclick = function(e) {
		if(e.target.tagName != "INPUT") return;
		var name = e.target.getAttribute("name");
		var value1 = e.target.checked;
		haxeprinter.Demo.cfg[name] = value1;
		haxeprinter.Demo.update();
	};
	input.oninput = function(e1) {
		haxeprinter.Demo.update();
	};
	input.innerText = haxe.Resource.getString("source");
	haxeprinter.Demo.update();
};
haxeprinter.Demo.update = function() {
	var input = window.document.getElementById("input");
	var output = window.document.getElementById("output");
	output.innerHTML = haxeprinter.Demo.format(input.innerText);
};
haxeprinter.Demo.format = function(source) {
	var input = byte.js._ByteData.ByteData_Impl_.ofString(source);
	var formatter = new haxeprinter.Formatter(input,haxeprinter.Demo.cfg,"foo/bar/TestSource.hx");
	var output;
	try {
		output = formatter.getContent();
	} catch( $e0 ) {
		if( js.Boot.__instanceof($e0,hxparse.NoMatch) ) {
			var e = $e0;
			return "<span class=\"error\">" + e.pos.format(input) + ": Unexpected " + Std.string(e.token.tok) + "</span>";
		} else if( js.Boot.__instanceof($e0,hxparse.Unexpected) ) {
			var e1 = $e0;
			return "<span class=\"error\">" + e1.pos.format(input) + ": Unexpected " + Std.string(e1.token.tok) + "</span>";
		} else {
		var e2 = $e0;
		return "<span class=\"error\">unknown error " + Std.string(e2) + "</span>";
		}
	}
	return output;
};
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.__name__ = true;
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype = {
	peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token
};
hxparse.ParserBuilder = function() { };
hxparse.ParserBuilder.__name__ = true;
haxeprinter.Formatter = function(input,config,sourceName) {
	this.hasNewlined = false;
	this.lineLen = 0;
	this.lineBuf = new StringBuf();
	this.col = 0;
	this.doc = null;
	this.tabs = "";
	this.lastChar = null;
	this.buf = new StringBuf();
	hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.call(this,new haxeparser.HaxeLexer(input,sourceName),haxeparser.HaxeLexer.tok);
	this.input = input;
	this.cfg = config;
	this.stack = [this.buf];
};
haxeprinter.Formatter.__name__ = true;
haxeprinter.Formatter.__interfaces__ = [hxparse.ParserBuilder];
haxeprinter.Formatter.__super__ = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token;
haxeprinter.Formatter.prototype = $extend(hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype,{
	getContent: function() {
		this.parseFile();
		var output = StringTools.trim(this.buf.b);
		if(this.cfg.empty_line_at_end_of_file) output += "\n";
		return output;
	}
	,startGroup: function() {
		this.lastChar = null;
		this.buf = new StringBuf();
		this.stack.unshift(this.buf);
	}
	,endGroup: function() {
		if(this.stack.length == 1) throw "no group to end";
		var group = this.stack.shift().toString();
		this.buf = this.stack[0];
		return StringTools.trim(group);
	}
	,endBlock: function() {
		var group = this.endGroup();
		this.lessTabs();
		if(group.length == 0) this.buf.b += " {}"; else if(this.cfg.cuddle_type_braces) this.buf.b += Std.string(" {\n" + this.tabs + "\n" + group + "\n" + this.tabs + "}"); else this.buf.b += Std.string("\n" + this.tabs + "{\n" + this.tabs + "\t" + group + "\n" + this.tabs + "}");
	}
	,addWordOrBlock: function(s,style) {
		if(s.indexOf("\n") > -1 || this.lastChar == "\n") this.addBlock(s,style); else this.addWord(s,style);
	}
	,addWord: function(s,style) {
		this.space();
		this.print(s,style);
	}
	,addBlock: function(s,style) {
		this.newline();
		this.print(s,style);
		this.newline();
	}
	,print: function(s,style) {
		if(this.doc != null) {
			var d = this.doc;
			this.doc = null;
			this.addWordOrBlock("/*" + d + "*/",haxeprinter.Style.SComment);
		}
		if(this.lastChar == "\n" || this.buf.b.length == 0) this.buf.b += Std.string(this.tabs);
		this.lastChar = s.charAt(s.length - 1);
		if(style == null) this.buf.b += Std.string(s); else {
			var style1 = ((function($this) {
				var $r;
				var _this = Std.string(style);
				$r = HxOverrides.substr(_this,1,null);
				return $r;
			}(this))).toLowerCase();
			this.buf.b += Std.string("<span class=\"" + style1 + "\">" + s + "</span>");
		}
	}
	,breakPoint: function(force) {
		if(force == null) force = false;
	}
	,newline: function(force) {
		if(force == null) force = false;
		if(force || this.lastChar != "\n" && this.lastChar != null) {
			this.buf.b += "\n";
			this.lastChar = "\n";
		}
	}
	,moreTabs: function() {
		this.tabs += "\t";
	}
	,lessTabs: function() {
		this.tabs = HxOverrides.substr(this.tabs,1,null);
	}
	,space: function() {
		if(this.lastChar == " " || this.lastChar == "\t" || this.lastChar == "\n" || this.lastChar == null) return;
		this.print(" ");
	}
	,brace: function(cuddle) {
		if(cuddle) this.space(); else this.newline();
	}
	,printString: function(s,pos) {
		var c = byte.js._ByteData.ByteData_Impl_.readString(this.input,pos.min,1);
		this.print("" + c + s + c,haxeprinter.Style.SString);
	}
	,peek: function(n) {
		if(n != 0) throw "n != 0";
		var tok = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,n);
		{
			var _g = tok.tok;
			switch(_g[1]) {
			case 7:
				var s = _g[2];
				this.addWord("//" + s,haxeprinter.Style.SComment);
				this.newline();
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.peek(0);
			case 6:
				var s1 = _g[2];
				this.doc = s1;
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.peek(0);
			case 2:
				var s2 = _g[2];
				var s3 = _g[2];
				var s4 = _g[2];
				switch(_g[2]) {
				case "error":
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("#error",haxeprinter.Style.SMacro);
					this.print(" ");
					{
						var _g1 = this.peek(0).tok;
						switch(_g1[1]) {
						case 1:
							switch(_g1[2][1]) {
							case 2:
								var s5 = _g1[2][2];
								this.last = this.token.elt;
								this.token = this.token.next;
								this.print("\"" + s5 + "\"",haxeprinter.Style.SString);
								break;
							default:
								throw "String expected";
							}
							break;
						default:
							throw "String expected";
						}
					}
					return this.peek(0);
				case "if":case "elseif":
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("#" + s2,haxeprinter.Style.SMacro);
					this.space();
					this.skipMacroCond();
					this.startGroup();
					return this.peek(0);
				case "end":case "else":
					this.last = this.token.elt;
					this.token = this.token.next;
					var group = this.endGroup();
					if(group.indexOf("\n") > -1) this.newline(); else this.print(" ");
					this.print(group);
					if(group.indexOf("\n") > -1) this.newline(); else this.print(" ");
					this.print("#" + s3,haxeprinter.Style.SMacro);
					if(group.indexOf("\n") > -1) this.newline();
					return this.peek(0);
				default:
					this.print("#" + s4,haxeprinter.Style.SMacro);
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.peek(0);
				}
				break;
			default:
				return tok;
			}
		}
	}
	,skipMacroCond: function() {
		{
			var _g = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,0).tok;
			var tok = _g;
			var tok1 = _g;
			switch(_g[1]) {
			case 1:
				switch(_g[2][1]) {
				case 3:
					this.print(haxeparser.TokenDefPrinter.print(tok),haxeprinter.Style.SMacro);
					this.last = this.token.elt;
					this.token = this.token.next;
					break;
				default:
					throw "Invalid macro cond: " + Std.string(tok1);
				}
				break;
			case 0:
				this.print(haxeparser.TokenDefPrinter.print(tok),haxeprinter.Style.SMacro);
				this.last = this.token.elt;
				this.token = this.token.next;
				break;
			case 18:
				var pCount = 0;
				while(true) {
					var _g1 = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,0).tok;
					var tok2 = _g1;
					switch(_g1[1]) {
					case 18:
						++pCount;
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print("(",haxeprinter.Style.SMacro);
						break;
					case 19:
						--pCount;
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print(")",haxeprinter.Style.SMacro);
						if(pCount == 0) return;
						break;
					default:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print(haxeparser.TokenDefPrinter.print(tok2),haxeprinter.Style.SMacro);
					}
				}
				break;
			case 4:
				switch(_g[2][1]) {
				case 2:
					this.print("!",haxeprinter.Style.SMacro);
					this.last = this.token.elt;
					this.token = this.token.next;
					this.skipMacroCond();
					break;
				default:
					throw "Invalid macro cond: " + Std.string(tok1);
				}
				break;
			default:
				throw "Invalid macro cond: " + Std.string(tok1);
			}
		}
	}
	,printModifier: function(modifier) {
		var order = this.cfg.modifier_order;
		modifier.sort(function(a,b) {
			return HxOverrides.indexOf(order,a,0) - HxOverrides.indexOf(order,b,0);
		});
		var _g = 0;
		while(_g < modifier.length) {
			var modifier1 = modifier[_g];
			++_g;
			this.print(modifier1,haxeprinter.Style.SModifier);
			this.print(" ");
		}
	}
	,parseAnyIdent: function(style) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var s = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s,style);
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 41:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("macro",style);
					break;
				case 22:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("new",style);
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 3:
				var s1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("$" + s1,style);
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseTypeHint: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				if(this.cfg.space_before_type_hint_colon) this.space();
				this.print(":");
				if(this.cfg.space_after_type_hint_colon) this.space();
				this.parseComplexType();
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseAssignment: function(spaceBefore,spaceAfter) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 4:
					this.last = this.token.elt;
					this.token = this.token.next;
					if(spaceBefore) this.space();
					this.print("=");
					if(spaceAfter) this.space();
					this.parseExpr();
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseFunction: function() {
		this.print("function",haxeprinter.Style.SKwd);
		this.print(" ");
		this.popt((function(f,a1) {
			return function() {
				return f(a1);
			};
		})($bind(this,this.parseAnyIdent),null));
		this.popt($bind(this,this.parseTypeParameters));
		this.expect(haxeparser.TokenDef.POpen);
		this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseFunctionArgument),this.withSpace(this.cfg.space_between_function_args));
		this.expect(haxeparser.TokenDef.PClose);
		this.popt($bind(this,this.parseTypeHint));
		this.popt($bind(this,this.parseExpr));
	}
	,parseFunctionArgument: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("?");
				break;
			default:
				null;
			}
		}
		{
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 1:
				switch(_g1.tok[2][1]) {
				case 3:
					var s = _g1.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s,haxeprinter.Style.SIdent);
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
		this.popt($bind(this,this.parseTypeHint));
		this.popt((function(f,a1,a2) {
			return function() {
				return f(a1,a2);
			};
		})($bind(this,this.parseAssignment),this.cfg.space_around_function_arg_assign,this.cfg.space_around_function_arg_assign));
	}
	,parseModifier: function() {
		var modifiers = [];
		while(true) {
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				var k = _g.tok[2];
				switch(_g.tok[2][1]) {
				case 17:case 18:case 19:case 25:case 35:case 41:case 33:case 31:
					this.last = this.token.elt;
					this.token = this.token.next;
					var modifier = ((function($this) {
						var $r;
						var _this = Std.string(k);
						$r = HxOverrides.substr(_this,3,null);
						return $r;
					}(this))).toLowerCase();
					modifiers.push(modifier);
					this.print(modifier,haxeprinter.Style.SKwd);
					this.space();
					break;
				default:
					return modifiers;
				}
				break;
			default:
				return modifiers;
			}
		}
	}
	,parseCallArguments: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseExpr),this.withSpace(this.cfg.space_between_function_args));
				this.expect(haxeparser.TokenDef.PClose);
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseMetaName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(":");
				break;
			default:
				null;
			}
		}
		{
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 1:
				switch(_g1.tok[2][1]) {
				case 3:
					var s = _g1.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s,haxeprinter.Style.SIdent);
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 0:
				var kwd = _g1.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(HxOverrides.substr(kwd[0],3,null).toLowerCase(),haxeprinter.Style.SKwd);
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseMeta: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 21:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("@");
				this.parseMetaName();
				this.popt($bind(this,this.parseCallArguments));
				this.parseMeta();
				break;
			default:
				return;
			}
		}
	}
	,parseFile: function() {
		this.peek(0);
		this.startGroup();
		this.parseMeta();
		this.parseModifier();
		var meta = this.endGroup();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				var kwd = _g.tok[2];
				var kwd1 = _g.tok[2];
				switch(_g.tok[2][1]) {
				case 34:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					this.print("package",haxeprinter.Style.SDecl);
					if(this.peek(0).tok == haxeparser.TokenDef.Semicolon) {
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print(";");
					} else {
						this.space();
						this.parseDotPath();
						this.expect(haxeparser.TokenDef.Semicolon);
					}
					break;
				case 13:case 36:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					this.print(kwd == haxeparser.Keyword.KwdImport?"import":"using",haxeprinter.Style.SDecl);
					this.print(" ");
					this.popt($bind(this,this.parseDotPath));
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 5:
							switch(_g1.tok[2][1]) {
							case 1:
								this.last = this.token.elt;
								this.token = this.token.next;
								this.print("*",haxeprinter.Style.SType);
								break;
							default:
								null;
							}
							break;
						default:
							null;
						}
					}
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 0:
							switch(_g11.tok[2][1]) {
							case 27:
								this.last = this.token.elt;
								this.token = this.token.next;
								this.print(" ");
								this.print("in",haxeprinter.Style.SDecl);
								this.print(" ");
								this.parseAnyIdent(haxeprinter.Style.SType);
								break;
							default:
								null;
							}
							break;
						default:
							null;
						}
					}
					this.semicolon();
					break;
				case 1:case 28:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					if(this.cfg.empty_line_before_type) this.newline(true);
					if(meta.length > 0) this.print(meta + " ");
					this.print(kwd1 == haxeparser.Keyword.KwdClass?"class":"interface",haxeprinter.Style.SDecl);
					this.space();
					this.parseAnyIdent(haxeprinter.Style.SType);
					this.popt($bind(this,this.parseTypeParameters));
					this.parseHeritance();
					this.expect(haxeparser.TokenDef.BrOpen,false);
					this.startGroup();
					this.moreTabs();
					this.parseClassFields(false);
					this.endBlock();
					break;
				case 26:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					if(this.cfg.empty_line_before_type) this.newline(true);
					if(meta.length > 0) this.print(meta + " ");
					this.print("enum",haxeprinter.Style.SDecl);
					this.space();
					this.parseAnyIdent(haxeprinter.Style.SType);
					this.popt($bind(this,this.parseTypeParameters));
					this.expect(haxeparser.TokenDef.BrOpen,false);
					this.startGroup();
					this.moreTabs();
					this.parseEnumFields(false);
					this.endBlock();
					break;
				case 32:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					if(this.cfg.empty_line_before_type) this.newline(true);
					if(meta.length > 0) this.print(meta + " ");
					this.print("typedef",haxeprinter.Style.SDecl);
					this.space();
					this.parseAnyIdent(haxeprinter.Style.SType);
					this.popt($bind(this,this.parseTypeParameters));
					if(this.cfg.space_around_typedef_assign) this.space();
					this.expect(haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssign));
					if(this.cfg.space_around_typedef_assign) this.space();
					this.parseComplexType();
					this.semicolon();
					break;
				case 40:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.newline();
					if(this.cfg.empty_line_before_type) this.newline(true);
					if(meta.length > 0) this.print(meta + " ");
					this.print("abstract",haxeprinter.Style.SDecl);
					this.print(" ");
					this.parseAnyIdent(haxeprinter.Style.SType);
					this.popt($bind(this,this.parseTypeParameters));
					this.popt($bind(this,this.parseAbstractThis));
					this.popt($bind(this,this.parseAbstractRelations));
					this.expect(haxeparser.TokenDef.BrOpen,false);
					this.startGroup();
					this.moreTabs();
					this.parseEnumFields(false);
					this.endBlock();
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 22:
				this.last = this.token.elt;
				this.token = this.token.next;
				return;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
		this.parseFile();
	}
	,parseTypeParameters: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 9:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("<");
					this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseTypeParameter),this.withSpace(this.cfg.space_between_type_params));
					this.expect(haxeparser.TokenDef.Binop(haxe.macro.Binop.OpGt));
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseTypeParameter: function() {
		this.parseAnyIdent(haxeprinter.Style.SType);
		this.popt($bind(this,this.parseConstraints));
	}
	,parseConstraints: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(":");
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 18:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print("(");
						this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseComplexType),this.withSpace(this.cfg.space_between_type_param_constraints));
						this.expect(haxeparser.TokenDef.PClose);
						break;
					default:
						this.parseComplexType();
						null;
					}
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseHeritance: function() {
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 0:
					switch(_g.tok[2][1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.space();
						this.print("extends",haxeprinter.Style.SDecl);
						this.space();
						this.parseComplexType();
						this.breakPoint(this.cfg.extends_on_newline);
						break;
					case 12:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.space();
						this.print("implements",haxeprinter.Style.SDecl);
						this.space();
						this.parseComplexType();
						this.breakPoint(this.cfg.implements_on_newline);
						break;
					default:
						throw "__break__";
					}
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	}
	,parseClassFields: function(hadField) {
		this.parseMeta();
		this.parseModifier();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("var",haxeprinter.Style.SKwd);
					this.space();
					this.parseAnyIdent();
					this.popt($bind(this,this.parsePropertyAccessors));
					this.popt($bind(this,this.parseTypeHint));
					this.popt((function(f,a1,a2) {
						return function() {
							return f(a1,a2);
						};
					})($bind(this,this.parseAssignment),this.cfg.space_around_property_assign,this.cfg.space_around_property_assign));
					this.semicolon();
					this.newline();
					if(this.cfg.empty_line_between_fields) this.newline(true);
					break;
				case 0:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.parseFunction();
					this.semicolon();
					this.newline();
					if(this.cfg.empty_line_between_fields) this.newline(true);
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 17:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.lessTabs();
				return;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
		this.parseClassFields(true);
	}
	,parsePropertyIdent: function() {
		try {
			this.parseAnyIdent(haxeprinter.Style.SKwd);
			null;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 0:
						switch(_g.tok[2][1]) {
						case 16:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print("default",haxeprinter.Style.SKwd);
							break;
						case 37:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print("null",haxeprinter.Style.SKwd);
							break;
						case 33:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print("dynamic",haxeprinter.Style.SKwd);
							break;
						default:
							throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
						}
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
			} else throw(_);
		}
	}
	,parsePropertyAccessors: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.parsePropertyIdent();
				this.expect(haxeparser.TokenDef.Comma);
				if(this.cfg.space_between_property_get_set) this.print(" ");
				this.parsePropertyIdent();
				this.expect(haxeparser.TokenDef.PClose);
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseEnumFields: function(hadField) {
		this.parseMeta();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 17:
				this.last = this.token.elt;
				this.token = this.token.next;
				return;
			default:
				null;
			}
		}
		this.parseAnyIdent(haxeprinter.Style.SType);
		this.popt($bind(this,this.parseTypeParameters));
		{
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseFunctionArgument),this.withSpace(this.cfg.space_between_function_args));
				this.expect(haxeparser.TokenDef.PClose);
				break;
			default:
				null;
			}
		}
		this.popt($bind(this,this.parseTypeHint));
		this.semicolon();
		this.parseEnumFields(true);
	}
	,parseAbstractThis: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.parseComplexType();
				this.expect(haxeparser.TokenDef.PClose);
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseAbstractRelations: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var s = _g.tok[2][2];
					switch(_g.tok[2][2]) {
					case "from":case "to":
						this.last = this.token.elt;
						this.token = this.token.next;
						this.space();
						this.print(s,haxeprinter.Style.SDecl);
						this.parseComplexType();
						this.parseAbstractRelations();
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseDotPath: function() {
		this.parseAnyIdent(haxeprinter.Style.SType);
		null;
		this.popt($bind(this,this.parseDotPathNext));
	}
	,parseDotPathNext: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(".",haxeprinter.Style.SType);
				this.parseDotPath();
				break;
			case 5:
				switch(_g.tok[2][1]) {
				case 9:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("<");
					this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseComplexType),this.withSpace(this.cfg.space_between_type_params));
					this.expect(haxeparser.TokenDef.Binop(haxe.macro.Binop.OpGt));
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseStructureFields: function() {
		try {
			this.parseClassFields(false);
			null;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseStructureTypeField),this.withSpace(this.cfg.space_between_anon_type_fields));
				this.space();
				this.expect(haxeparser.TokenDef.BrClose);
			} else throw(_);
		}
	}
	,parseComplexType: function() {
		try {
			this.parseDotPath();
			null;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 18:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print("(");
						this.parseComplexType();
						this.expect(haxeparser.TokenDef.PClose);
						break;
					case 16:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print("{ ");
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 5:
								switch(_g1.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print("> ");
									this.parseComplexType();
									this.expect(haxeparser.TokenDef.Comma);
									this.parseStructureFields();
									break;
								default:
									this.parseStructureFields();
									null;
								}
								break;
							default:
								this.parseStructureFields();
								null;
							}
						}
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
			} else throw(_);
		}
		this.popt($bind(this,this.parseComplexTypeNext));
	}
	,parseComplexTypeNext: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 12:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(" -> ");
				this.parseComplexType();
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseStructureTypeField: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("?");
				break;
			default:
				null;
			}
		}
		this.parseAnyIdent();
		if(this.cfg.space_before_structure_colon) this.space();
		this.expect(haxeparser.TokenDef.DblDot);
		if(this.cfg.space_after_structure_colon) this.space();
		this.parseComplexType();
	}
	,parseStructureElement: function() {
		try {
			this.parseAnyIdent();
			null;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 1:
						switch(_g.tok[2][1]) {
						case 2:
							var p = _g.pos;
							var s = _g.tok[2][2];
							this.last = this.token.elt;
							this.token = this.token.next;
							this.printString(s,p);
							break;
						default:
							throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
						}
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
			} else throw(_);
		}
		if(this.cfg.space_before_structure_colon) this.space();
		this.expect(haxeparser.TokenDef.DblDot);
		if(this.cfg.space_after_structure_colon) this.space();
		this.parseExpr();
	}
	,parseVarDeclaration: function() {
		this.parseAnyIdent();
		this.popt($bind(this,this.parseTypeHint));
		this.popt((function(f,a1,a2) {
			return function() {
				return f(a1,a2);
			};
		})($bind(this,this.parseAssignment),true,true));
	}
	,parseMacroExpr: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(" : ");
				this.parseComplexType();
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("var",haxeprinter.Style.SKwd);
					this.print(" ");
					this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseVarDeclaration),this.withSpace(true));
					break;
				default:
					this.parseExpr();
					null;
				}
				break;
			default:
				this.parseExpr();
				null;
			}
		}
	}
	,parseCatch: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 21:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("catch",haxeprinter.Style.SKwd);
					this.print(" ");
					this.expect(haxeparser.TokenDef.POpen);
					this.parseAnyIdent();
					this.expect(haxeparser.TokenDef.DblDot);
					this.parseComplexType();
					this.expect(haxeparser.TokenDef.PClose);
					this.parseExpr();
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseBlockElement: function() {
		this.newline();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("var",haxeprinter.Style.SKwd);
					this.print(" ");
					this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseVarDeclaration),this.withSpace(true));
					this.semicolon();
					break;
				default:
					this.parseExpr();
					this.semicolon();
				}
				break;
			default:
				this.parseExpr();
				this.semicolon();
			}
		}
	}
	,parseBlockOrStructure: function() {
		this.newline();
		this.print("{");
		this.newline();
		this.moreTabs();
		{
			var _g = this.peek(0);
			var fieldToken = _g.tok;
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 11:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print(haxeparser.TokenDefPrinter.print(fieldToken),haxeprinter.Style.SIdent);
							if(this.cfg.space_before_structure_colon) this.space();
							this.print(":");
							if(this.cfg.space_after_structure_colon) this.space();
							this.parseExpr();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 13:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print(",");
									this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseStructureElement),this.withSpace(this.cfg.space_between_anon_type_fields));
									this.expect(haxeparser.TokenDef.BrClose);
									break;
								case 17:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.lessTabs();
									this.newline();
									this.print("}");
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							switch(fieldToken[1]) {
							case 1:
								switch(fieldToken[2][1]) {
								case 3:
									var s = fieldToken[2][2];
									this.print(s,haxeprinter.Style.SIdent);
									break;
								case 2:
									var s1 = fieldToken[2][2];
									this.printString(s1,p);
									break;
								default:
									throw false;
								}
								break;
							default:
								throw false;
							}
							this.parseExprNext();
							this.semicolon();
							this.plist($bind(this,this.parseBlockElement));
							this.lessTabs();
							this.newline();
							this.expect(haxeparser.TokenDef.BrClose);
						}
					}
					break;
				case 2:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 11:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print(haxeparser.TokenDefPrinter.print(fieldToken),haxeprinter.Style.SIdent);
							if(this.cfg.space_before_structure_colon) this.space();
							this.print(":");
							if(this.cfg.space_after_structure_colon) this.space();
							this.parseExpr();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 13:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print(",");
									this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseStructureElement),this.withSpace(this.cfg.space_between_anon_type_fields));
									this.expect(haxeparser.TokenDef.BrClose);
									break;
								case 17:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.lessTabs();
									this.newline();
									this.print("}");
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							switch(fieldToken[1]) {
							case 1:
								switch(fieldToken[2][1]) {
								case 3:
									var s = fieldToken[2][2];
									this.print(s,haxeprinter.Style.SIdent);
									break;
								case 2:
									var s1 = fieldToken[2][2];
									this.printString(s1,p);
									break;
								default:
									throw false;
								}
								break;
							default:
								throw false;
							}
							this.parseExprNext();
							this.semicolon();
							this.plist($bind(this,this.parseBlockElement));
							this.lessTabs();
							this.newline();
							this.expect(haxeparser.TokenDef.BrClose);
						}
					}
					break;
				default:
					this.plist($bind(this,this.parseBlockElement));
					this.lessTabs();
					this.newline();
					this.expect(haxeparser.TokenDef.BrClose);
				}
				break;
			case 17:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("}");
				break;
			default:
				this.plist($bind(this,this.parseBlockElement));
				this.lessTabs();
				this.newline();
				this.expect(haxeparser.TokenDef.BrClose);
			}
		}
	}
	,parseExpr: function() {
		this.parseMeta();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 0:
					var s = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s,haxeprinter.Style.SConst);
					break;
				case 1:
					var s = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s,haxeprinter.Style.SConst);
					break;
				case 3:
					var s1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(s1,haxeprinter.Style.SIdent);
					break;
				case 2:
					var p = _g.pos;
					var s2 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.printString(s2,p);
					break;
				case 4:
					var o = _g.tok[2][3];
					var p1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("~/" + p1 + "/" + o,haxeprinter.Style.SConst);
					break;
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 38:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("true",haxeprinter.Style.SConst);
					break;
				case 39:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("false",haxeprinter.Style.SConst);
					break;
				case 37:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("null",haxeprinter.Style.SConst);
					break;
				case 23:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("this",haxeprinter.Style.SDecl);
					break;
				case 29:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("untyped",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					break;
				case 41:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("macro",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseMacroExpr();
					break;
				case 8:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("break",haxeprinter.Style.SKwd);
					break;
				case 9:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("continue",haxeprinter.Style.SKwd);
					break;
				case 0:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.parseFunction();
					break;
				case 10:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("return",haxeprinter.Style.SKwd);
					this.print(" ");
					this.popt($bind(this,this.parseExpr));
					break;
				case 24:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("throw",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					break;
				case 30:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							this.print("(");
							this.parseExpr();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 13:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print(",");
									this.parseComplexType();
									break;
								default:
									null;
								}
							}
							this.expect(haxeparser.TokenDef.PClose);
							break;
						default:
							this.parseExpr();
							null;
						}
					}
					break;
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("var",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseVarDeclaration();
					break;
				case 3:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("if",haxeprinter.Style.SKwd);
					this.print(" ");
					this.expect(haxeparser.TokenDef.POpen);
					this.parseExpr();
					this.expect(haxeparser.TokenDef.PClose);
					this.space();
					this.parseExpr();
					this.semicolon();
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 0:
							switch(_g11.tok[2][1]) {
							case 4:
								this.last = this.token.elt;
								this.token = this.token.next;
								this.print("else",haxeprinter.Style.SKwd);
								this.print(" ");
								this.parseExpr();
								break;
							default:
								null;
							}
							break;
						default:
							null;
						}
					}
					break;
				case 22:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("new",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseDotPath();
					this.expect(haxeparser.TokenDef.POpen);
					this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseExpr),this.withSpace(this.cfg.space_between_function_args));
					this.expect(haxeparser.TokenDef.PClose);
					break;
				case 7:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("for",haxeprinter.Style.SKwd);
					this.print(" ");
					this.expect(haxeparser.TokenDef.POpen);
					this.parseExpr();
					this.expect(haxeparser.TokenDef.PClose);
					this.parseExpr();
					break;
				case 5:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("while",haxeprinter.Style.SKwd);
					this.print(" ");
					this.expect(haxeparser.TokenDef.POpen);
					this.parseExpr();
					this.expect(haxeparser.TokenDef.PClose);
					this.parseExpr();
					break;
				case 6:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("do",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					this.expect(haxeparser.TokenDef.Kwd(haxeparser.Keyword.KwdWhile));
					this.expect(haxeparser.TokenDef.POpen);
					this.parseExpr();
					this.expect(haxeparser.TokenDef.PClose);
					break;
				case 20:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("try",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					this.plist($bind(this,this.parseCatch));
					break;
				case 14:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("switch",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					this.space();
					this.expect(haxeparser.TokenDef.BrOpen);
					this.moreTabs();
					try {
						while(true) {
							var _g12 = this.peek(0);
							switch(_g12.tok[1]) {
							case 0:
								switch(_g12.tok[2][1]) {
								case 15:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.newline();
									this.print("case",haxeprinter.Style.SKwd);
									this.print(" ");
									this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseExpr),this.withSpace(true));
									{
										var _g21 = this.peek(0);
										switch(_g21.tok[1]) {
										case 11:
											this.last = this.token.elt;
											this.token = this.token.next;
											this.print(": ");
											break;
										case 0:
											switch(_g21.tok[2][1]) {
											case 3:
												this.last = this.token.elt;
												this.token = this.token.next;
												this.print("if",haxeprinter.Style.SKwd);
												this.print(" ");
												this.expect(haxeparser.TokenDef.POpen);
												this.parseExpr();
												this.expect(haxeparser.TokenDef.PClose);
												this.expect(haxeparser.TokenDef.DblDot);
												break;
											default:
												throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
											}
											break;
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									this.moreTabs();
									try {
										while(true) {
											var _g22 = this.peek(0).tok;
											switch(_g22[1]) {
											case 0:
												switch(_g22[2][1]) {
												case 15:case 16:
													throw "__break__";
													break;
												default:
													this.newline();
													this.parseBlockElement();
												}
												break;
											case 17:
												throw "__break__";
												break;
											default:
												this.newline();
												this.parseBlockElement();
											}
										}
									} catch( e ) { if( e != "__break__" ) throw e; }
									this.lessTabs();
									break;
								case 16:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.newline();
									this.print("default",haxeprinter.Style.SKwd);
									this.expect(haxeparser.TokenDef.DblDot);
									this.moreTabs();
									try {
										while(true) {
											var _g23 = this.peek(0).tok;
											switch(_g23[1]) {
											case 17:
												throw "__break__";
												break;
											default:
												this.newline();
												this.parseBlockElement();
											}
										}
									} catch( e ) { if( e != "__break__" ) throw e; }
									this.lessTabs();
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
								break;
							case 17:
								this.last = this.token.elt;
								this.token = this.token.next;
								this.print("}");
								throw "__break__";
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
					this.lessTabs();
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 3:
				var s3 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("$" + s3,haxeprinter.Style.SKwd);
				{
					var _g13 = this.peek(0);
					switch(_g13.tok[1]) {
					case 16:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print("{");
						this.parseExpr();
						this.expect(haxeparser.TokenDef.BrClose);
						break;
					default:
						null;
					}
				}
				break;
			case 5:
				switch(_g.tok[2][1]) {
				case 3:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print("-");
					this.parseExpr();
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 16:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.parseBlockOrStructure();
				break;
			case 14:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("[");
				this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseExpr),this.withSpace(true));
				this.expect(haxeparser.TokenDef.BkClose);
				break;
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.parseExpr();
				{
					var _g14 = this.peek(0);
					switch(_g14.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print(" : ");
						this.parseComplexType();
						this.expect(haxeparser.TokenDef.PClose);
						break;
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						this.print(")");
						break;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 4:
				var op = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(new haxe.macro.Printer().printUnop(op));
				this.parseExpr();
				break;
			case 8:
				var s4 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(s4);
				this.print("...");
				this.parseExpr();
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
		this.parseExprNext();
	}
	,parseExprNext: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("(");
				this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseExpr),this.withSpace(this.cfg.space_between_function_args));
				this.expect(haxeparser.TokenDef.PClose);
				this.parseExprNext();
				break;
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(".");
				this.parseAnyIdent();
				this.parseExprNext();
				break;
			case 5:
				var op = _g.tok[2];
				switch(_g.tok[2][1]) {
				case 7:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.print(">");
					try {
						while(true) {
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 5:
								switch(_g1.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print(">");
									break;
								case 4:
									this.last = this.token.elt;
									this.token = this.token.next;
									this.print("=");
									break;
								default:
									this.space();
									this.parseExpr();
									this.parseExprNext();
									throw "__break__";
								}
								break;
							default:
								this.space();
								this.parseExpr();
								this.parseExprNext();
								throw "__break__";
							}
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
					break;
				default:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.space();
					this.print(new haxe.macro.Printer().printBinop(op));
					this.space();
					this.parseExpr();
					this.parseExprNext();
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 27:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.space();
					this.print("in",haxeprinter.Style.SKwd);
					this.print(" ");
					this.parseExpr();
					this.parseExprNext();
					break;
				default:
					null;
				}
				break;
			case 14:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print("[");
				this.parseExpr();
				this.expect(haxeparser.TokenDef.BkClose);
				this.parseExprNext();
				break;
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(" ? ");
				this.parseExpr();
				this.space();
				this.expect(haxeparser.TokenDef.DblDot);
				this.space();
				this.parseExpr();
				this.parseExprNext();
				break;
			case 4:
				var op1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(new haxe.macro.Printer().printUnop(op1));
				this.parseExprNext();
				break;
			default:
				null;
			}
		}
	}
	,withSpace: function(b) {
		if(b) return (function(f,s) {
			return function() {
				return f(s);
			};
		})($bind(this,this.print)," "); else return function() {
		};
	}
	,semicolon: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 9:
				this.last = this.token.elt;
				this.token = this.token.next;
				this.print(";");
				break;
			default:
				null;
			}
		}
	}
	,expect: function(tok,printTok) {
		if(printTok == null) printTok = true;
		if(!Type.enumEq(this.peek(0).tok,tok)) throw this.stream.curPos().format(this.input) + (":Expected " + Std.string(tok) + " but found " + Std.string(this.peek(0)));
		if(printTok) this.print(haxeparser.TokenDefPrinter.print(tok));
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,popt: function(f) {
		try {
			var v = f();
			return v;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				return null;
			} else throw(_);
		}
	}
	,psep: function(sep,f,fSep) {
		while(true) try {
			f();
			var tok = this.peek(0);
			if(tok.tok == sep) {
				this.print(haxeparser.TokenDefPrinter.print(tok.tok));
				fSep();
				this.last = this.token.elt;
				this.token = this.token.next;
			} else return;
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				return;
			} else throw(e);
		}
	}
	,plist: function(f) {
		try {
			while(true) f();
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
			} else throw(e);
		}
	}
	,__class__: haxeprinter.Formatter
});
haxeprinter.Style = { __ename__ : true, __constructs__ : ["SNormal","SDecl","SOperator","SConst","SKwd","SIdent","SString","SNumber","SType","SModifier","SComment","SMacro"] };
haxeprinter.Style.SNormal = ["SNormal",0];
haxeprinter.Style.SNormal.toString = $estr;
haxeprinter.Style.SNormal.__enum__ = haxeprinter.Style;
haxeprinter.Style.SDecl = ["SDecl",1];
haxeprinter.Style.SDecl.toString = $estr;
haxeprinter.Style.SDecl.__enum__ = haxeprinter.Style;
haxeprinter.Style.SOperator = ["SOperator",2];
haxeprinter.Style.SOperator.toString = $estr;
haxeprinter.Style.SOperator.__enum__ = haxeprinter.Style;
haxeprinter.Style.SConst = ["SConst",3];
haxeprinter.Style.SConst.toString = $estr;
haxeprinter.Style.SConst.__enum__ = haxeprinter.Style;
haxeprinter.Style.SKwd = ["SKwd",4];
haxeprinter.Style.SKwd.toString = $estr;
haxeprinter.Style.SKwd.__enum__ = haxeprinter.Style;
haxeprinter.Style.SIdent = ["SIdent",5];
haxeprinter.Style.SIdent.toString = $estr;
haxeprinter.Style.SIdent.__enum__ = haxeprinter.Style;
haxeprinter.Style.SString = ["SString",6];
haxeprinter.Style.SString.toString = $estr;
haxeprinter.Style.SString.__enum__ = haxeprinter.Style;
haxeprinter.Style.SNumber = ["SNumber",7];
haxeprinter.Style.SNumber.toString = $estr;
haxeprinter.Style.SNumber.__enum__ = haxeprinter.Style;
haxeprinter.Style.SType = ["SType",8];
haxeprinter.Style.SType.toString = $estr;
haxeprinter.Style.SType.__enum__ = haxeprinter.Style;
haxeprinter.Style.SModifier = ["SModifier",9];
haxeprinter.Style.SModifier.toString = $estr;
haxeprinter.Style.SModifier.__enum__ = haxeprinter.Style;
haxeprinter.Style.SComment = ["SComment",10];
haxeprinter.Style.SComment.toString = $estr;
haxeprinter.Style.SComment.__enum__ = haxeprinter.Style;
haxeprinter.Style.SMacro = ["SMacro",11];
haxeprinter.Style.SMacro.toString = $estr;
haxeprinter.Style.SMacro.__enum__ = haxeprinter.Style;
hxparse._LexEngine.Transition = function(chars) {
	this.chars = chars;
};
hxparse._LexEngine.Transition.__name__ = true;
hxparse._LexEngine.Transition.prototype = {
	toString: function() {
		return Std.string(this.chars);
	}
	,__class__: hxparse._LexEngine.Transition
};
hxparse.NoMatch = function(pos,token) {
	this.pos = pos;
	this.token = token;
};
hxparse.NoMatch.__name__ = true;
hxparse.NoMatch.prototype = {
	toString: function() {
		return "" + Std.string(this.pos) + ": No match: " + Std.string(this.token);
	}
	,__class__: hxparse.NoMatch
};
hxparse.Parser = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser.__name__ = true;
hxparse.Parser.prototype = {
	peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser
};
hxparse.RuleBuilderImpl = function() { };
hxparse.RuleBuilderImpl.__name__ = true;
hxparse.State = function() {
	this["final"] = -1;
	var this1;
	this1 = new Array(256);
	this.trans = this1;
};
hxparse.State.__name__ = true;
hxparse.State.prototype = {
	__class__: hxparse.State
};
hxparse.Unexpected = function(token,pos) {
	this.token = token;
	this.pos = pos;
};
hxparse.Unexpected.__name__ = true;
hxparse.Unexpected.prototype = {
	toString: function() {
		return "Unexpected " + Std.string(this.token) + " at " + Std.string(this.pos);
	}
	,__class__: hxparse.Unexpected
};
hxparse.UnexpectedChar = function(char,pos) {
	this.char = char;
	this.pos = pos;
};
hxparse.UnexpectedChar.__name__ = true;
hxparse.UnexpectedChar.prototype = {
	toString: function() {
		return "" + Std.string(this.pos) + ": Unexpected " + this.char;
	}
	,__class__: hxparse.UnexpectedChar
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
haxe.Resource.content = [{ name : "config-default", data : "ewoJImN1ZGRsZV9tZXRob2RfYnJhY2VzIjpmYWxzZSwKCSJjdWRkbGVfdHlwZV9icmFjZXMiOmZhbHNlLAoJImVtcHR5X2xpbmVfYXRfZW5kX29mX2ZpbGUiOnRydWUsCgkiZW1wdHlfbGluZV9iZWZvcmVfaW1wb3J0cyI6ZmFsc2UsCgkiZW1wdHlfbGluZV9iZWZvcmVfdHlwZSI6dHJ1ZSwKCSJlbXB0eV9saW5lX2JldHdlZW5fZW51bV9jb25zdHJ1Y3RvcnMiOmZhbHNlLAoJImVtcHR5X2xpbmVfYmV0d2Vlbl9maWVsZHMiOnRydWUsCgkiZW1wdHlfbGluZV9iZXR3ZWVuX3R5cGVkZWZfZmllbGRzIjpmYWxzZSwKCSJleHRlbmRzX29uX25ld2xpbmUiOmZhbHNlLAoJImZ1bmN0aW9uX2FyZ19vbl9uZXdsaW5lIjpmYWxzZSwKCSJpbXBsZW1lbnRzX29uX25ld2xpbmUiOmZhbHNlLAoJImlubGluZV9lbXB0eV9icmFjZXMiOmZhbHNlLAoJIm1heGltdW1fbGluZV9sZW5ndGgiOjEwMCwKCSJtb2RpZmllcl9vcmRlciI6WyJvdmVycmlkZSIsICJwdWJsaWMiLCAicHJpdmF0ZSIsICJzdGF0aWMiLCAiZXh0ZXJuIiwgImR5bmFtaWMiLCAiaW5saW5lIiwgIm1hY3JvIl0sCgkicHJpbnRfcm9vdF9wYWNrYWdlIjpmYWxzZSwKCSJyZW1vdmVfcHJpdmF0ZV9maWVsZF9tb2RpZmllciI6ZmFsc2UsCgkic3BhY2VfYWZ0ZXJfc3RydWN0dXJlX2NvbG9uIjpmYWxzZSwKCSJzcGFjZV9hZnRlcl90eXBlX2hpbnRfY29sb24iOmZhbHNlLAoJInNwYWNlX2Fyb3VuZF9mdW5jdGlvbl9hcmdfYXNzaWduIjpmYWxzZSwKCSJzcGFjZV9hcm91bmRfcHJvcGVydHlfYXNzaWduIjp0cnVlLAoJInNwYWNlX2Fyb3VuZF90eXBlZGVmX2Fzc2lnbiI6dHJ1ZSwKCSJzcGFjZV9iZWZvcmVfc3RydWN0dXJlX2NvbG9uIjpmYWxzZSwKCSJzcGFjZV9iZWZvcmVfdHlwZV9oaW50X2NvbG9uIjpmYWxzZSwKCSJzcGFjZV9iZXR3ZWVuX2Fub25fdHlwZV9maWVsZHMiOnRydWUsCgkic3BhY2VfYmV0d2Vlbl9lbnVtX2NvbnN0cnVjdG9yX2FyZ3MiOmZhbHNlLAoJInNwYWNlX2JldHdlZW5fZnVuY3Rpb25fYXJncyI6dHJ1ZSwKCSJzcGFjZV9iZXR3ZWVuX3Byb3BlcnR5X2dldF9zZXQiOnRydWUsCgkic3BhY2VfYmV0d2Vlbl90eXBlX3BhcmFtX2NvbnN0cmFpbnRzIjp0cnVlLAoJInNwYWNlX2JldHdlZW5fdHlwZV9wYXJhbXMiOnRydWUKfQ"},{ name : "config", data : "e30"},{ name : "source", data : "LyoKCUNvbW1lbnQKKi8KcGFja2FnZS8qIENvbW1lbnQgKi9wYWNrLnBhY2s7Ly8gQ29tbWVudExpbmUKCi8qCglFbXB0eSB0eXBlCiovCiNpZiBqcyBjbGFzcyBFbXB0eUNsYXNzCnsKfQojZW5kCgovKgoJQ2xhc3MKKi8KZXh0ZXJuICNpZiBqcyBwcml2YXRlICNlbmQgY2xhc3MgTXlDbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3MgaW1wbGVtZW50cyBJbnRlcmZhY2UKewoJLyoKCQlDb21tZW50CgkqLwoJdmFyIHZhcmlhYmxlOkludCA9IDA7CgoJLyoKCQlDb21tZW50CgkqLwoJdmFyIHByb3BlcnR5KGdldCwgc2V0KTpJbnQgPSAwOwp9CgovKgoJRW51bQoqLwpleHRlcm4gZW51bSBNeUVudW0KewoJTXlFbnVtVmFsdWU7Cn0"}];
byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2 = Math.log(2);
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
hxparse.LexEngine.MAX_CODE = 255;
hxparse.LexEngine.EMPTY = [];
hxparse.LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
haxeparser.HaxeLexer.keywords = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("abstract",haxeparser.Keyword.KwdAbstract);
	_g.set("break",haxeparser.Keyword.KwdBreak);
	_g.set("case",haxeparser.Keyword.KwdCase);
	_g.set("cast",haxeparser.Keyword.KwdCast);
	_g.set("catch",haxeparser.Keyword.KwdCatch);
	_g.set("class",haxeparser.Keyword.KwdClass);
	_g.set("continue",haxeparser.Keyword.KwdContinue);
	_g.set("default",haxeparser.Keyword.KwdDefault);
	_g.set("do",haxeparser.Keyword.KwdDo);
	_g.set("dynamic",haxeparser.Keyword.KwdDynamic);
	_g.set("else",haxeparser.Keyword.KwdElse);
	_g.set("enum",haxeparser.Keyword.KwdEnum);
	_g.set("extends",haxeparser.Keyword.KwdExtends);
	_g.set("extern",haxeparser.Keyword.KwdExtern);
	_g.set("false",haxeparser.Keyword.KwdFalse);
	_g.set("for",haxeparser.Keyword.KwdFor);
	_g.set("function",haxeparser.Keyword.KwdFunction);
	_g.set("if",haxeparser.Keyword.KwdIf);
	_g.set("implements",haxeparser.Keyword.KwdImplements);
	_g.set("import",haxeparser.Keyword.KwdImport);
	_g.set("in",haxeparser.Keyword.KwdIn);
	_g.set("inline",haxeparser.Keyword.KwdInline);
	_g.set("interface",haxeparser.Keyword.KwdInterface);
	_g.set("macro",haxeparser.Keyword.KwdMacro);
	_g.set("new",haxeparser.Keyword.KwdNew);
	_g.set("null",haxeparser.Keyword.KwdNull);
	_g.set("override",haxeparser.Keyword.KwdOverride);
	_g.set("package",haxeparser.Keyword.KwdPackage);
	_g.set("private",haxeparser.Keyword.KwdPrivate);
	_g.set("public",haxeparser.Keyword.KwdPublic);
	_g.set("return",haxeparser.Keyword.KwdReturn);
	_g.set("static",haxeparser.Keyword.KwdStatic);
	_g.set("switch",haxeparser.Keyword.KwdSwitch);
	_g.set("this",haxeparser.Keyword.KwdThis);
	_g.set("throw",haxeparser.Keyword.KwdThrow);
	_g.set("true",haxeparser.Keyword.KwdTrue);
	_g.set("try",haxeparser.Keyword.KwdTry);
	_g.set("typedef",haxeparser.Keyword.KwdTypedef);
	_g.set("untyped",haxeparser.Keyword.KwdUntyped);
	_g.set("using",haxeparser.Keyword.KwdUsing);
	_g.set("var",haxeparser.Keyword.KwdVar);
	_g.set("while",haxeparser.Keyword.KwdWhile);
	$r = _g;
	return $r;
}(this));
haxeparser.HaxeLexer.buf = new StringBuf();
haxeparser.HaxeLexer.ident = "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*";
haxeparser.HaxeLexer.idtype = "_*[A-Z][a-zA-Z0-9_]*";
haxeparser.HaxeLexer.tok = hxparse.Lexer.buildRuleset([{ rule : "", func : function(lexer) {
	return haxeparser.HaxeLexer.mk(lexer,haxeparser.TokenDef.Eof);
}},{ rule : "[\r\n\t ]", func : function(lexer1) {
	return lexer1.token(haxeparser.HaxeLexer.tok);
}},{ rule : "0x[0-9a-fA-F]+", func : function(lexer2) {
	return haxeparser.HaxeLexer.mk(lexer2,haxeparser.TokenDef.Const(haxe.macro.Constant.CInt(lexer2.current)));
}},{ rule : "[0-9]+", func : function(lexer3) {
	return haxeparser.HaxeLexer.mk(lexer3,haxeparser.TokenDef.Const(haxe.macro.Constant.CInt(lexer3.current)));
}},{ rule : "[0-9]+.[0-9]+", func : function(lexer4) {
	return haxeparser.HaxeLexer.mk(lexer4,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer4.current)));
}},{ rule : ".[0-9]+", func : function(lexer5) {
	return haxeparser.HaxeLexer.mk(lexer5,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer5.current)));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer6) {
	return haxeparser.HaxeLexer.mk(lexer6,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer6.current)));
}},{ rule : "[0-9]+.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer7) {
	return haxeparser.HaxeLexer.mk(lexer7,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer7.current)));
}},{ rule : "[0-9]+...", func : function(lexer8) {
	return haxeparser.HaxeLexer.mk(lexer8,haxeparser.TokenDef.IntInterval(HxOverrides.substr(lexer8.current,0,-3)));
}},{ rule : "//[^\n\r]*", func : function(lexer9) {
	return haxeparser.HaxeLexer.mk(lexer9,haxeparser.TokenDef.CommentLine(HxOverrides.substr(lexer9.current,2,null)));
}},{ rule : "+\\+", func : function(lexer10) {
	return haxeparser.HaxeLexer.mk(lexer10,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpIncrement));
}},{ rule : "--", func : function(lexer11) {
	return haxeparser.HaxeLexer.mk(lexer11,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpDecrement));
}},{ rule : "~", func : function(lexer12) {
	return haxeparser.HaxeLexer.mk(lexer12,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpNegBits));
}},{ rule : "%=", func : function(lexer13) {
	return haxeparser.HaxeLexer.mk(lexer13,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMod)));
}},{ rule : "&=", func : function(lexer14) {
	return haxeparser.HaxeLexer.mk(lexer14,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAnd)));
}},{ rule : "|=", func : function(lexer15) {
	return haxeparser.HaxeLexer.mk(lexer15,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpOr)));
}},{ rule : "^=", func : function(lexer16) {
	return haxeparser.HaxeLexer.mk(lexer16,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpXor)));
}},{ rule : "+=", func : function(lexer17) {
	return haxeparser.HaxeLexer.mk(lexer17,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAdd)));
}},{ rule : "-=", func : function(lexer18) {
	return haxeparser.HaxeLexer.mk(lexer18,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpSub)));
}},{ rule : "*=", func : function(lexer19) {
	return haxeparser.HaxeLexer.mk(lexer19,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMult)));
}},{ rule : "/=", func : function(lexer20) {
	return haxeparser.HaxeLexer.mk(lexer20,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpDiv)));
}},{ rule : "<<=", func : function(lexer21) {
	return haxeparser.HaxeLexer.mk(lexer21,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpShl)));
}},{ rule : "==", func : function(lexer22) {
	return haxeparser.HaxeLexer.mk(lexer22,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpEq));
}},{ rule : "!=", func : function(lexer23) {
	return haxeparser.HaxeLexer.mk(lexer23,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpNotEq));
}},{ rule : "<=", func : function(lexer24) {
	return haxeparser.HaxeLexer.mk(lexer24,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpLte));
}},{ rule : "&&", func : function(lexer25) {
	return haxeparser.HaxeLexer.mk(lexer25,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpBoolAnd));
}},{ rule : "|\\|", func : function(lexer26) {
	return haxeparser.HaxeLexer.mk(lexer26,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpBoolOr));
}},{ rule : "<<", func : function(lexer27) {
	return haxeparser.HaxeLexer.mk(lexer27,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpShl));
}},{ rule : "->", func : function(lexer28) {
	return haxeparser.HaxeLexer.mk(lexer28,haxeparser.TokenDef.Arrow);
}},{ rule : "...", func : function(lexer29) {
	return haxeparser.HaxeLexer.mk(lexer29,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpInterval));
}},{ rule : "=>", func : function(lexer30) {
	return haxeparser.HaxeLexer.mk(lexer30,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpArrow));
}},{ rule : "!", func : function(lexer31) {
	return haxeparser.HaxeLexer.mk(lexer31,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpNot));
}},{ rule : "<", func : function(lexer32) {
	return haxeparser.HaxeLexer.mk(lexer32,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpLt));
}},{ rule : ">", func : function(lexer33) {
	return haxeparser.HaxeLexer.mk(lexer33,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpGt));
}},{ rule : ";", func : function(lexer34) {
	return haxeparser.HaxeLexer.mk(lexer34,haxeparser.TokenDef.Semicolon);
}},{ rule : ":", func : function(lexer35) {
	return haxeparser.HaxeLexer.mk(lexer35,haxeparser.TokenDef.DblDot);
}},{ rule : ",", func : function(lexer36) {
	return haxeparser.HaxeLexer.mk(lexer36,haxeparser.TokenDef.Comma);
}},{ rule : ".", func : function(lexer37) {
	return haxeparser.HaxeLexer.mk(lexer37,haxeparser.TokenDef.Dot);
}},{ rule : "%", func : function(lexer38) {
	return haxeparser.HaxeLexer.mk(lexer38,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpMod));
}},{ rule : "&", func : function(lexer39) {
	return haxeparser.HaxeLexer.mk(lexer39,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAnd));
}},{ rule : "|", func : function(lexer40) {
	return haxeparser.HaxeLexer.mk(lexer40,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpOr));
}},{ rule : "^", func : function(lexer41) {
	return haxeparser.HaxeLexer.mk(lexer41,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpXor));
}},{ rule : "+", func : function(lexer42) {
	return haxeparser.HaxeLexer.mk(lexer42,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAdd));
}},{ rule : "*", func : function(lexer43) {
	return haxeparser.HaxeLexer.mk(lexer43,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpMult));
}},{ rule : "/", func : function(lexer44) {
	return haxeparser.HaxeLexer.mk(lexer44,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpDiv));
}},{ rule : "-", func : function(lexer45) {
	return haxeparser.HaxeLexer.mk(lexer45,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpSub));
}},{ rule : "=", func : function(lexer46) {
	return haxeparser.HaxeLexer.mk(lexer46,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssign));
}},{ rule : "[", func : function(lexer47) {
	return haxeparser.HaxeLexer.mk(lexer47,haxeparser.TokenDef.BkOpen);
}},{ rule : "]", func : function(lexer48) {
	return haxeparser.HaxeLexer.mk(lexer48,haxeparser.TokenDef.BkClose);
}},{ rule : "{", func : function(lexer49) {
	return haxeparser.HaxeLexer.mk(lexer49,haxeparser.TokenDef.BrOpen);
}},{ rule : "}", func : function(lexer50) {
	return haxeparser.HaxeLexer.mk(lexer50,haxeparser.TokenDef.BrClose);
}},{ rule : "\\(", func : function(lexer51) {
	return haxeparser.HaxeLexer.mk(lexer51,haxeparser.TokenDef.POpen);
}},{ rule : "\\)", func : function(lexer52) {
	return haxeparser.HaxeLexer.mk(lexer52,haxeparser.TokenDef.PClose);
}},{ rule : "?", func : function(lexer53) {
	return haxeparser.HaxeLexer.mk(lexer53,haxeparser.TokenDef.Question);
}},{ rule : "@", func : function(lexer54) {
	return haxeparser.HaxeLexer.mk(lexer54,haxeparser.TokenDef.At);
}},{ rule : "\"", func : function(lexer55) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin = new hxparse.Position(lexer55.source,lexer55.pos - lexer55.current.length,lexer55.pos);
	var pmax;
	try {
		pmax = lexer55.token(haxeparser.HaxeLexer.string);
	} catch( e ) {
		if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedString,haxeparser.HaxeLexer.mkPos(pmin));
		} else throw(e);
	}
	var token = haxeparser.HaxeLexer.mk(lexer55,haxeparser.TokenDef.Const(haxe.macro.Constant.CString(haxeparser.HaxeLexer.buf.b)));
	token.pos.min = pmin.pmin;
	return token;
}},{ rule : "'", func : function(lexer56) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin1 = new hxparse.Position(lexer56.source,lexer56.pos - lexer56.current.length,lexer56.pos);
	var pmax1;
	try {
		pmax1 = lexer56.token(haxeparser.HaxeLexer.string2);
	} catch( e1 ) {
		if( js.Boot.__instanceof(e1,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedString,haxeparser.HaxeLexer.mkPos(pmin1));
		} else throw(e1);
	}
	var token1 = haxeparser.HaxeLexer.mk(lexer56,haxeparser.TokenDef.Const(haxe.macro.Constant.CString(haxeparser.HaxeLexer.buf.b)));
	token1.pos.min = pmin1.pmin;
	return token1;
}},{ rule : "~/", func : function(lexer57) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin2 = new hxparse.Position(lexer57.source,lexer57.pos - lexer57.current.length,lexer57.pos);
	var info;
	try {
		info = lexer57.token(haxeparser.HaxeLexer.regexp);
	} catch( e2 ) {
		if( js.Boot.__instanceof(e2,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedRegExp,haxeparser.HaxeLexer.mkPos(pmin2));
		} else throw(e2);
	}
	var token2 = haxeparser.HaxeLexer.mk(lexer57,haxeparser.TokenDef.Const(haxe.macro.Constant.CRegexp(haxeparser.HaxeLexer.buf.b,info.opt)));
	token2.pos.min = pmin2.pmin;
	return token2;
}},{ rule : "/\\*", func : function(lexer58) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin3 = new hxparse.Position(lexer58.source,lexer58.pos - lexer58.current.length,lexer58.pos);
	var pmax2;
	try {
		pmax2 = lexer58.token(haxeparser.HaxeLexer.comment);
	} catch( e3 ) {
		if( js.Boot.__instanceof(e3,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnclosedComment,haxeparser.HaxeLexer.mkPos(pmin3));
		} else throw(e3);
	}
	var token3 = haxeparser.HaxeLexer.mk(lexer58,haxeparser.TokenDef.Comment(haxeparser.HaxeLexer.buf.b));
	token3.pos.min = pmin3.pmin;
	return token3;
}},{ rule : "(#)(_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*)", func : function(lexer59) {
	return haxeparser.HaxeLexer.mk(lexer59,haxeparser.TokenDef.Sharp(HxOverrides.substr(lexer59.current,1,null)));
}},{ rule : "$[_a-zA-Z0-9]*", func : function(lexer60) {
	return haxeparser.HaxeLexer.mk(lexer60,haxeparser.TokenDef.Dollar(HxOverrides.substr(lexer60.current,1,null)));
}},{ rule : "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer61) {
	var kwd = haxeparser.HaxeLexer.keywords.get(lexer61.current);
	if(kwd != null) return haxeparser.HaxeLexer.mk(lexer61,haxeparser.TokenDef.Kwd(kwd)); else return haxeparser.HaxeLexer.mk(lexer61,haxeparser.TokenDef.Const(haxe.macro.Constant.CIdent(lexer61.current)));
}},{ rule : "_*[A-Z][a-zA-Z0-9_]*", func : function(lexer62) {
	return haxeparser.HaxeLexer.mk(lexer62,haxeparser.TokenDef.Const(haxe.macro.Constant.CIdent(lexer62.current)));
}}]);
haxeparser.HaxeLexer.string = hxparse.Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "\\";
	return lexer.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\n", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer1.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\r", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer2.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\\"", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += "\"";
	return lexer4.token(haxeparser.HaxeLexer.string);
}},{ rule : "\"", func : function(lexer5) {
	return new hxparse.Position(lexer5.source,lexer5.pos - lexer5.current.length,lexer5.pos).pmax;
}},{ rule : "[^\\\\\"]+", func : function(lexer6) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer6.current);
	return lexer6.token(haxeparser.HaxeLexer.string);
}}]);
haxeparser.HaxeLexer.string2 = hxparse.Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "\\";
	return lexer.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\n", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer1.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\r", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer2.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\'", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += "\"";
	return lexer4.token(haxeparser.HaxeLexer.string2);
}},{ rule : "'", func : function(lexer5) {
	return new hxparse.Position(lexer5.source,lexer5.pos - lexer5.current.length,lexer5.pos).pmax;
}},{ rule : "[^\\\\']+", func : function(lexer6) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer6.current);
	return lexer6.token(haxeparser.HaxeLexer.string2);
}}]);
haxeparser.HaxeLexer.comment = hxparse.Lexer.buildRuleset([{ rule : "*/", func : function(lexer) {
	return new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax;
}},{ rule : "*", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "*";
	return lexer1.token(haxeparser.HaxeLexer.comment);
}},{ rule : "[^\\*]", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer2.current);
	return lexer2.token(haxeparser.HaxeLexer.comment);
}}]);
haxeparser.HaxeLexer.regexp = hxparse.Lexer.buildRuleset([{ rule : "\\\\/", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "/";
	return lexer.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\r", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer1.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\n", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer2.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\[\\$\\.*+\\^|{}\\[\\]()?\\-0-9]", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer4.current);
	return lexer4.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\[wWbBsSdDx]", func : function(lexer5) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer5.current);
	return lexer5.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "/", func : function(lexer6) {
	return lexer6.token(haxeparser.HaxeLexer.regexp_options);
}},{ rule : "[^\\\\/\r\n]+", func : function(lexer7) {
	haxeparser.HaxeLexer.buf.b += Std.string(lexer7.current);
	return lexer7.token(haxeparser.HaxeLexer.regexp);
}}]);
haxeparser.HaxeLexer.regexp_options = hxparse.Lexer.buildRuleset([{ rule : "[gimsu]*", func : function(lexer) {
	return { pmax : new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax, opt : lexer.current};
}}]);
haxeprinter.Demo.main();
})();
