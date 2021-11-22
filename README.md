# capacitor-crisp

Crisp native SDK for capacitor

## Install

```bash
npm install capacitor-crisp
npx cap sync
```

## API

<docgen-index>

* [`configure(...)`](#configure)
* [`openMessenger()`](#openmessenger)
* [`setTokenID(...)`](#settokenid)
* [`setUser(...)`](#setuser)
* [`pushEvent(...)`](#pushevent)
* [`setCompany(...)`](#setcompany)
* [`setInt(...)`](#setint)
* [`setString(...)`](#setstring)
* [`setSegment(...)`](#setsegment)
* [`reset()`](#reset)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### configure(...)

```typescript
configure(data: { websiteID: string; }) => any
```

| Param      | Type                                |
| ---------- | ----------------------------------- |
| **`data`** | <code>{ websiteID: string; }</code> |

**Returns:** <code>any</code>

--------------------


### openMessenger()

```typescript
openMessenger() => any
```

**Returns:** <code>any</code>

--------------------


### setTokenID(...)

```typescript
setTokenID(data: { tokenID: string; }) => any
```

| Param      | Type                              |
| ---------- | --------------------------------- |
| **`data`** | <code>{ tokenID: string; }</code> |

**Returns:** <code>any</code>

--------------------


### setUser(...)

```typescript
setUser(data: { nickname?: string; phone?: string; email?: string; avatar?: string; }) => any
```

| Param      | Type                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ |
| **`data`** | <code>{ nickname?: string; phone?: string; email?: string; avatar?: string; }</code> |

**Returns:** <code>any</code>

--------------------


### pushEvent(...)

```typescript
pushEvent(data: { name: string; color: eventColor; }) => any
```

| Param      | Type                                              |
| ---------- | ------------------------------------------------- |
| **`data`** | <code>{ name: string; color: eventColor; }</code> |

**Returns:** <code>any</code>

--------------------


### setCompany(...)

```typescript
setCompany(data: { name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }) => any
```

| Param      | Type                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data`** | <code>{ name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }</code> |

**Returns:** <code>any</code>

--------------------


### setInt(...)

```typescript
setInt(data: { key: string; value: number; }) => any
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: number; }</code> |

**Returns:** <code>any</code>

--------------------


### setString(...)

```typescript
setString(data: { key: string; value: string; }) => any
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: string; }</code> |

**Returns:** <code>any</code>

--------------------


### setSegment(...)

```typescript
setSegment(data: { segment: string; }) => any
```

| Param      | Type                              |
| ---------- | --------------------------------- |
| **`data`** | <code>{ segment: string; }</code> |

**Returns:** <code>any</code>

--------------------


### reset()

```typescript
reset() => any
```

**Returns:** <code>any</code>

--------------------

</docgen-api>
