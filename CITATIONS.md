# Code Citations

This document contains citations for code snippets and patterns used in this project.

## UI Components

### Select City Dropdown

Source: https://github.com/Aldrin1807/WorkWise/blob/7c16fcbb4d02e4065b113258c4c19a4b90cf27cf/work-wise/src/Components/Middle/Content.tsx

```jsx
<select
  onChange={(e) => setCity(e.target.value)}
  value={city}
  id="city"
  className='className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
  required
>
  <option value="">Select City</option>
  {cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>
```

### Close Button SVG

Source: Multiple repositories including:

- https://github.com/Rajatgurung/vebholicReactTest/blob/1ec267c98ef58fdf4ea7ea529e73533fa8d73942/src/components/Util/Model.jsx
- https://github.com/chaskiq/chaskiq/blob/c136551b02a50d44ab65d43f690c1fe2e18a030b/app/javascript/src/pages/Billing.tsx
- https://github.com/Cyphen12/bawaseer.js/blob/31f3011599767afd4401304db1425840160ac72f/components/NavComponent.tsx

```jsx
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M6 18L18 6M6 6l12 12"
  ></path>
</svg>
```

All code has been modified and adapted to fit the needs of this project.
