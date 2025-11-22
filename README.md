# pb-defaults

Configure default values for your Pocketbase collection fields

## Overview

**pb-defaults** is a simple and easy-to-use extension for Pocketbase that allows you to configure default values for your collection fields through a user-friendly admin interface. No need to manually write hooks - just use the visual dashboard to set your defaults!

## Features

- 🎯 Set default values for any collection field through a visual interface
- 🖥️ Clean, intuitive admin dashboard
- ⚡ Easy installation - just copy the hooks
- 🔧 Automatically generates Pocketbase hooks for you
- 💾 Saves configuration as JSON for easy backup and version control
- 🔄 Hot-reload support - changes take effect immediately
- 🌐 Multi-language support

## Installation

### Step 1: Copy the hooks

Copy the entire contents of the `pb_hooks` folder to your Pocketbase `pb_hooks` directory:

```bash
cp -r pb_hooks/* /path/to/your/pocketbase/pb_hooks/
```

Your directory structure should look like this:
```
your-pocketbase/
├── pb_hooks/
│   ├── default-plugin/
│   │   └── page-default-fields.html
│   └── default-fields.pb.js
└── pocketbase
```

### Step 2: Login to the admin dashboard

If you aren't already, login to the normal `/_` admin dashboard of your server (e.g., `http://localhost:8090/_`). The hooks dashboard piggybacks this auth token.

### Step 3: Access the Default Values Manager

Navigate to the Default Values Manager by accessing `/_/defaults`:

```
http://localhost:8090/_/defaults
```

## Usage

1. Open the Default Values Manager at `/_/defaults`
2. Browse your available collections
3. Select a collection to configure default values
4. Set default values for the desired fields
5. Click "Save" to apply your configuration

The system will:
- Generate a `default-values.pb.js` hook file automatically
- Save your configuration to `default.json`
- Apply default values whenever new records are created

## How it Works

pb-defaults works in three parts:

1. **Admin Dashboard** (`/_/defaults`): A visual interface to configure your default values
2. **API Endpoints**: 
   - `GET /api/default-fields`: Retrieves current configuration
   - `POST /api/default-fields`: Saves configuration and generates hooks
3. **Auto-generated Hooks**: The system automatically creates `default-values.pb.js` which contains `onRecordCreateExecute` hooks for each configured collection

When you save your configuration, the system:
1. Stores your settings in `default.json`
2. Generates Pocketbase hook code automatically
3. Writes it to `default-values.pb.js`
4. The hooks apply your defaults when records are created

> **Note on Performance:** This plugin uses auto-generated hooks instead of runtime evaluation for optimal performance. During testing, this approach showed minimal performance impact on record creation, ensuring your backend operates at full speed even with multiple default values configured.

### Generated Hook Example

When you configure defaults for a `users` collection, the system generates code like:

```javascript
onRecordCreateExecute((e) => {
    e.record.set("role", "user")
    e.record.set("verified", false)
    e.record.set("credits", 100)
    e.next()
}, "users")
```

## Files Created

After configuration, you'll see these files in your Pocketbase directory:

- `pb_hooks/default-values.pb.js` - Auto-generated hooks (don't edit manually!)
- `default.json` - Your configuration backup

## Requirements

- Pocketbase v0.18.0 or higher
- Admin authentication enabled
- JavaScript hooks support enabled

## API Reference

### GET `/_/defaults`
Returns the admin dashboard HTML interface.

### GET `/api/default-fields`
Returns the current default fields configuration as JSON.

**Response:**
```json
{
  "users": {
    "role": "user",
    "verified": false
  },
  "posts": {
    "status": "draft"
  }
}
```

### POST `/api/default-fields`
Saves the default fields configuration and regenerates the hooks file.

**Request Body:**
```json
{
  "collectionName": {
    "fieldName": "defaultValue"
  }
}
```

## Tips

- ✅ Changes take effect immediately - no server restart needed
- ✅ The `default.json` file can be version controlled
- ✅ You can manually edit `default.json` and the hooks will regenerate on next save
- ⚠️ Don't manually edit `default-values.pb.js` - it will be overwritten
- ⚠️ Make sure your default values match the field types in your collections

## Troubleshooting

**Dashboard not loading?**
- Ensure you're logged into the admin panel first at `/_`
- Check that the `pb_hooks` folder structure is correct

**Defaults not applying?**
- Verify that `default-values.pb.js` was generated
- Check the Pocketbase logs for any hook errors
- Ensure field names match exactly with your collection schema

**Configuration lost after restart?**
- The `default.json` file should persist your settings
- Make sure the file has proper write permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for the Pocketbase community
