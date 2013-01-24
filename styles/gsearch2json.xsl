<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">
    <xsl:output method="text" encoding="utf-8"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="/">
        [<xsl:for-each select=".//object">
            {
            "type": "<xsl:apply-templates select="field[@name='dc.type']"/>",
            "description": "<xsl:apply-templates select="field[@name='dc.description']"/>",
            "coverage": "<xsl:apply-templates select="field[@name='dc.coverage']"/>",
            "date": "<xsl:apply-templates select="field[@name='dc.date']"/>",
            "identifier": "<xsl:apply-templates select="field[@name='dc.identifier']"/>",
            "subject": [<xsl:for-each select="field[@name='dc.subject']">"<xsl:apply-templates select="."/>"<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
            "language": [<xsl:for-each select="field[@name='dc.language']">"<xsl:apply-templates select="."/>"<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
            "rights": "<xsl:apply-templates select="field[@name='dc.rights']"/>",
            "title": "<xsl:apply-templates select="field[@name='dc.title']"/>"
            }<xsl:if test="position()!=last()">,</xsl:if>
        </xsl:for-each>
         ]
    </xsl:template>

<xsl:template name="escape-quote">
 <xsl:param name="string"/>
<xsl:variable name="quote">"</xsl:variable>
<xsl:choose>
 <xsl:when test='contains($string, $quote)'><xsl:value-of select="substring-before($string,$quote)"/><xsl:text>\"</xsl:text><xsl:call-template name="escape-quote"><xsl:with-param name="string" select="substring-after($string, $quote)" /></xsl:call-template></xsl:when>
 <xsl:otherwise><xsl:value-of select="$string"/></xsl:otherwise>
</xsl:choose>
</xsl:template>

    <xsl:template match="field">
	<xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="field/text()">
	<xsl:call-template name="escape-quote">
	<xsl:with-param name="string"><xsl:value-of select="normalize-space(.)"/></xsl:with-param>
	</xsl:call-template>
    </xsl:template>

    <xsl:template match="span">
	<xsl:if test="preceding-sibling::text()"><xsl:text> </xsl:text></xsl:if><xsl:value-of select="."/><xsl:if test="following-sibling::text()"><xsl:text> </xsl:text></xsl:if>
    </xsl:template>
</xsl:stylesheet>
