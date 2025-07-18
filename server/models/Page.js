const { db } = require('../database/connection');

class Page {
  constructor(data) {
    this.idPages = data.idPages;
    this.pageName = data.pageName;
    this.pageUrl = data.pageUrl;
    this.isParent = data.isParent || 0;
    this.idParent = data.idParent || '0';
    this.menuIcon = data.menuIcon;
    this.menuClass = data.menuClass;
    this.isMenu = data.isMenu || 1;
    this.isTitle = data.isTitle || 0;
    this.titlePara = data.titlePara;
    this.sort_no = data.sort_no || 1;
    this.isActive = data.isActive || 1;
    this.createdBy = data.createdBy;
    this.createdDateTime = data.createdDateTime;
    this.updateBy = data.updateBy;
    this.updatedDateTime = data.updatedDateTime;
    this.deleteBy = data.deleteBy;
    this.deletedDateTime = data.deletedDateTime;
    this.langName = data.langName || 'en';
  }

  // Get all active pages
  static async findAll() {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE deletedDateTime IS NULL 
        ORDER BY sort_no, idPages
      `;
      
      const result = await db.query(query);
      return result.recordset.map(row => new Page(row));
    } catch (error) {
      console.error('Error fetching all pages:', error);
      throw error;
    }
  }

  // Get page by ID
  static async findById(pageId) {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE idPages = @pageId AND deletedDateTime IS NULL
      `;
      
      const result = await db.query(query, { pageId });
      return result.recordset.length > 0 ? new Page(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error fetching page by ID:', error);
      throw error;
    }
  }

  // Get page by URL
  static async findByUrl(pageUrl) {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE pageUrl = @pageUrl AND deletedDateTime IS NULL
      `;
      
      const result = await db.query(query, { pageUrl });
      return result.recordset.length > 0 ? new Page(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error fetching page by URL:', error);
      throw error;
    }
  }

  // Get parent pages
  static async findParentPages() {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE isParent = 1 AND deletedDateTime IS NULL 
        ORDER BY sort_no
      `;
      
      const result = await db.query(query);
      return result.recordset.map(row => new Page(row));
    } catch (error) {
      console.error('Error fetching parent pages:', error);
      throw error;
    }
  }

  // Get child pages of a parent
  static async findChildPages(parentId) {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE idParent = @parentId AND deletedDateTime IS NULL 
        ORDER BY sort_no
      `;
      
      const result = await db.query(query, { parentId });
      return result.recordset.map(row => new Page(row));
    } catch (error) {
      console.error('Error fetching child pages:', error);
      throw error;
    }
  }

  // Get menu pages (hierarchical structure)
  static async getMenuPages() {
    try {
      const query = `
        SELECT * FROM Pages 
        WHERE isMenu = 1 AND isActive = 1 AND deletedDateTime IS NULL 
        ORDER BY sort_no
      `;
      
      const result = await db.query(query);
      const pages = result.recordset.map(row => new Page(row));
      
      // Organize into parent-child structure
      const parentPages = pages.filter(page => page.isParent === 1);
      const childPages = pages.filter(page => page.isParent === 0);
      
      return parentPages.map(parent => ({
        ...parent.toJSON(),
        children: childPages.filter(child => child.idParent === parent.idPages.toString())
          .map(child => child.toJSON())
      }));
    } catch (error) {
      console.error('Error fetching menu pages:', error);
      throw error;
    }
  }

  // Create new page
  static async create(pageData) {
    try {
      const { 
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass, 
        isMenu, isTitle, titlePara, sort_no, isActive, langName, createdBy 
      } = pageData;

      const query = `
        INSERT INTO Pages (
          pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
          isMenu, isTitle, titlePara, sort_no, isActive, langName,
          createdBy, createdDateTime
        )
        OUTPUT INSERTED.*
        VALUES (
          @pageName, @pageUrl, @isParent, @idParent, @menuIcon, @menuClass,
          @isMenu, @isTitle, @titlePara, @sort_no, @isActive, @langName,
          @createdBy, GETDATE()
        )
      `;

      const result = await db.query(query, {
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
        isMenu, isTitle, titlePara, sort_no, isActive, langName, createdBy
      });

      return new Page(result.recordset[0]);
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  // Update page
  static async update(pageId, pageData) {
    try {
      const { 
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass, 
        isMenu, isTitle, titlePara, sort_no, isActive, langName, updateBy 
      } = pageData;

      const query = `
        UPDATE Pages 
        SET pageName = @pageName, pageUrl = @pageUrl, isParent = @isParent, 
            idParent = @idParent, menuIcon = @menuIcon, menuClass = @menuClass,
            isMenu = @isMenu, isTitle = @isTitle, titlePara = @titlePara,
            sort_no = @sort_no, isActive = @isActive, langName = @langName,
            updateBy = @updateBy, updatedDateTime = GETDATE()
        OUTPUT INSERTED.*
        WHERE idPages = @pageId AND deletedDateTime IS NULL
      `;

      const result = await db.query(query, {
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
        isMenu, isTitle, titlePara, sort_no, isActive, langName, updateBy, pageId
      });

      return result.recordset.length > 0 ? new Page(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  // Soft delete page
  static async delete(pageId, deleteBy) {
    try {
      const query = `
        UPDATE Pages 
        SET deleteBy = @deleteBy, deletedDateTime = GETDATE()
        WHERE idPages = @pageId
      `;

      await db.query(query, { deleteBy, pageId });
      return true;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  // Check if page URL exists (for validation)
  static async urlExists(pageUrl, excludeId = null) {
    try {
      let query = `
        SELECT COUNT(*) as count FROM Pages 
        WHERE pageUrl = @pageUrl AND deletedDateTime IS NULL
      `;
      
      const params = { pageUrl };
      
      if (excludeId) {
        query += ` AND idPages != @excludeId`;
        params.excludeId = excludeId;
      }
      
      const result = await db.query(query, params);
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking page URL existence:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      idPages: this.idPages,
      pageName: this.pageName,
      pageUrl: this.pageUrl,
      isParent: this.isParent,
      idParent: this.idParent,
      menuIcon: this.menuIcon,
      menuClass: this.menuClass,
      isMenu: this.isMenu,
      isTitle: this.isTitle,
      titlePara: this.titlePara,
      sort_no: this.sort_no,
      isActive: this.isActive,
      createdBy: this.createdBy,
      createdDateTime: this.createdDateTime,
      updateBy: this.updateBy,
      updatedDateTime: this.updatedDateTime,
      langName: this.langName
    };
  }
}

module.exports = Page;
